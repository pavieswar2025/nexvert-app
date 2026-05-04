import { jsPDF } from 'jspdf';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateFileSize(file, maxSize = MAX_FILE_SIZE) {
  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" is too large (${formatBytes(file.size)}). Max size: ${formatBytes(maxSize)}`);
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// TEXT TO PDF
export async function textToPdf(text, options = {}) {
  const {
    fontSize = 12,
    fontFamily = 'helvetica',
    pageSize = 'a4',
    margins = 20,
    lineHeight = 1.5,
    title = '',
  } = options;

  const doc = new jsPDF({ format: pageSize });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const usableW = pageW - margins * 2;

  doc.setFont(fontFamily);
  doc.setFontSize(fontSize);

  if (title) {
    doc.setFontSize(fontSize + 6);
    doc.setFont(fontFamily, 'bold');
    doc.text(title, margins, margins + 8);
    doc.setFontSize(fontSize);
    doc.setFont(fontFamily, 'normal');
  }

  const startY = title ? margins + 20 : margins;
  const lineH = fontSize * lineHeight * 0.352778; // pt to mm

  const lines = doc.splitTextToSize(text, usableW);
  let y = startY;

  for (const line of lines) {
    if (y + lineH > pageH - margins) {
      doc.addPage();
      y = margins;
    }
    doc.text(line, margins, y);
    y += lineH;
  }

  return doc.output('blob');
}

// IMAGE TO PDF
export async function imageToPdf(files, options = {}) {
  const { pageSize = 'a4', orientation = 'portrait', margin = 10, fitMode = 'fit' } = options;
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    validateFileSize(file);
    const bytes = await file.arrayBuffer();
    const ext = file.type;

    let img;
    if (ext === 'image/jpeg' || ext === 'image/jpg') {
      img = await pdfDoc.embedJpg(bytes);
    } else if (ext === 'image/png') {
      img = await pdfDoc.embedPng(bytes);
    } else {
      // Convert to PNG via canvas
      const pngBytes = await convertImageToPngBytes(file);
      img = await pdfDoc.embedPng(pngBytes);
    }

    const sizes = { a4: [595, 842], letter: [612, 792], a3: [842, 1190] };
    const [pw, ph] = orientation === 'landscape'
      ? [sizes[pageSize][1], sizes[pageSize][0]]
      : sizes[pageSize] || sizes.a4;

    const page = pdfDoc.addPage([pw, ph]);
    const m = margin;
    const availW = pw - m * 2;
    const availH = ph - m * 2;

    let drawW = img.width;
    let drawH = img.height;

    if (fitMode === 'fit') {
      const scale = Math.min(availW / img.width, availH / img.height);
      drawW = img.width * scale;
      drawH = img.height * scale;
    } else if (fitMode === 'fill') {
      const scale = Math.max(availW / img.width, availH / img.height);
      drawW = img.width * scale;
      drawH = img.height * scale;
    }

    const x = m + (availW - drawW) / 2;
    const y = m + (availH - drawH) / 2;
    page.drawImage(img, { x, y, width: drawW, height: drawH });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

async function convertImageToPngBytes(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        blob.arrayBuffer().then(resolve).catch(reject);
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = url;
  });
}

// HTML TO PDF
export async function htmlToPdf(htmlContent, options = {}) {
  const { pageSize = 'a4', margins = 15 } = options;
  const doc = new jsPDF({ format: pageSize, unit: 'mm' });

  // Create temp iframe to render HTML
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;';
  document.body.appendChild(iframe);

  await new Promise(resolve => {
    iframe.onload = resolve;
    iframe.srcdoc = `<!DOCTYPE html><html><head><style>
      body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; margin: 0; padding: 20px; color: #111; background: white; }
      * { box-sizing: border-box; }
    </style></head><body>${htmlContent}</body></html>`;
  });

  const iframeDoc = iframe.contentDocument;
  const body = iframeDoc.body;

  // Simple text extraction for PDF
  const textContent = body.innerText || body.textContent || '';
  document.body.removeChild(iframe);

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const usableW = pageW - margins * 2;

  doc.setFont('helvetica');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(textContent, usableW);
  let y = margins;
  const lineH = 6;

  for (const line of lines) {
    if (y + lineH > pageH - margins) {
      doc.addPage();
      y = margins;
    }
    doc.text(line, margins, y);
    y += lineH;
  }

  return doc.output('blob');
}

// MERGE PDFs
export async function mergePdfs(files) {
  const merged = await PDFDocument.create();

  for (const file of files) {
    validateFileSize(file);
    const bytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
    pages.forEach(page => merged.addPage(page));
  }

  const pdfBytes = await merged.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// SPLIT PDF
export async function splitPdf(file, ranges) {
  validateFileSize(file);
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes);
  const totalPages = srcDoc.getPageCount();
  const results = [];

  for (const range of ranges) {
    const newDoc = await PDFDocument.create();
    const start = Math.max(0, range.start - 1);
    const end = Math.min(totalPages - 1, range.end - 1);
    const indices = [];
    for (let i = start; i <= end; i++) indices.push(i);
    if (indices.length === 0) continue;
    const pages = await newDoc.copyPages(srcDoc, indices);
    pages.forEach(p => newDoc.addPage(p));
    const pdfBytes = await newDoc.save();
    results.push({
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      name: `split_${range.start}-${range.end}.pdf`,
    });
  }

  return results;
}

export async function getPdfPageCount(file) {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}
