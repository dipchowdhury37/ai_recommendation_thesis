const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to escape XML
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function mdToDocxXml(mdText) {
  const lines = mdText.split('\n');
  let bodyXml = '';
  let inTable = false;
  let tableRows = [];

  function flushTable() {
    if (!inTable || tableRows.length === 0) return;
    let tblXml = '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="EEEEEE"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr>';
    
    tableRows.forEach((row, rIdx) => {
      tblXml += '<w:tr>';
      row.forEach(cell => {
        const isHeader = (rIdx === 0);
        tblXml += `<w:tc><w:tcPr><w:tcW w:w="2000" w:type="dxa"/>${isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="F0F4F8"/>' : ''}</w:tcPr><w:p><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/>${isHeader ? '<w:b/>' : ''}</w:rPr><w:t xml:space="preserve">${escapeXml(cell.trim())}</w:t></w:r></w:p></w:tc>`;
      });
      tblXml += '</w:tr>';
    });
    tblXml += '</w:tbl>';
    bodyXml += tblXml;
    tableRows = [];
    inTable = false;
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushTable();
      return;
    }

    // Table rows
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.includes('---')) {
        // Separator line, ignore
        return;
      }
      inTable = true;
      const cells = trimmed.split('|').slice(1, -1);
      tableRows.push(cells);
      return;
    } else {
      flushTable();
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      const text = trimmed.substring(2);
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:spacing w:before="360" w:after="160"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="36"/><w:color w:val="0F4C81"/></w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3);
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading2"/><w:spacing w:before="280" w:after="120"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="28"/><w:color w:val="1D2530"/></w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4);
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading3"/><w:spacing w:before="200" w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="24"/><w:color w:val="334155"/></w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const text = trimmed.substring(2);
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">• ${escapeXml(text.replace(/\*\*/g, ''))}</w:t></w:r></w:p>`;
    } else if (trimmed.startsWith('> ')) {
      const text = trimmed.substring(2);
      bodyXml += `<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="0F4C81"/></w:pPr><w:shd w:val="clear" w:color="auto" w:fill="F4F6F9"/><w:spacing w:before="120" w:after="120"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:i/><w:sz w:val="22"/><w:color w:val="1D2530"/></w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
    } else {
      // Normal paragraph
      bodyXml += `<w:p><w:pPr><w:spacing w:after="140" w:line="276" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/><w:color w:val="1D2530"/></w:rPr><w:t xml:space="preserve">${escapeXml(trimmed.replace(/\*\*/g, ''))}</w:t></w:r></w:p>`;
    }
  });

  flushTable();
  return bodyXml;
}

function createDocx(targetDocxPath, mdContent) {
  const tempDir = path.join(__dirname, 'temp_docx_' + Date.now());
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  const wordDir = path.join(tempDir, 'word');
  const relsDir = path.join(tempDir, '_rels');
  const wordRelsDir = path.join(wordDir, '_rels');

  fs.mkdirSync(wordDir, { recursive: true });
  fs.mkdirSync(relsDir, { recursive: true });
  fs.mkdirSync(wordRelsDir, { recursive: true });

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:sz w:val="22"/>
        <w:lang w:val="en-GB"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`;

  const bodyXml = mdToDocxXml(mdContent);
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypesXml, 'utf8');
  fs.writeFileSync(path.join(relsDir, '.rels'), rootRelsXml, 'utf8');
  fs.writeFileSync(path.join(wordDir, 'document.xml'), documentXml, 'utf8');
  fs.writeFileSync(path.join(wordDir, 'styles.xml'), stylesXml, 'utf8');
  fs.writeFileSync(path.join(wordRelsDir, 'document.xml.rels'), wordRelsXml, 'utf8');

  // Zip using PowerShell
  if (fs.existsSync(targetDocxPath)) fs.unlinkSync(targetDocxPath);
  const psCmd = `powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir.replace(/'/g, "''")}', '${targetDocxPath.replace(/'/g, "''")}')"`;
  execSync(psCmd);

  // Clean tempDir
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`Generated: ${path.basename(targetDocxPath)}`);
}

const files = [
  'Prototype_Design_and_Adaptation',
  'Prototype_Evaluation_Guide',
  'Prototype_Test_Report'
];

files.forEach(name => {
  const mdPath = path.join(__dirname, `${name}.md`);
  const docxPath = path.join(__dirname, `${name}.docx`);
  if (fs.existsSync(mdPath)) {
    const md = fs.readFileSync(mdPath, 'utf8');
    createDocx(docxPath, md);
  }
});

// Also create a master complete dissertation documentation file
const masterMd = `# Master's Dissertation Research Artefact Documentation

**Dissertation Title:** *Adaptive Cybersecurity Awareness Training for University Students: A Data-Driven Framework for Personalised Learning Design*  
**Artefact Bundle:** Prototype Implementation, Design Specification, Evaluation Protocol, and Test Suite  
**Date:** October 2026  

---

` + files.map(name => fs.readFileSync(path.join(__dirname, `${name}.md`), 'utf8')).join('\n\n---\n\n');

createDocx(path.join(__dirname, 'Cybersecurity_Training_Prototype_Documentation.docx'), masterMd);

console.log("All .docx files successfully created!");
