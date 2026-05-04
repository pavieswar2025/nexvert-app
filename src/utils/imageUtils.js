import { formatBytes, validateFileSize, MAX_FILE_SIZE } from './pdfUtils';

export { formatBytes, validateFileSize };

export const IMAGE_MAX_SIZE = 20 * 1024 * 1024; // 20MB

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

// CONVERT IMAGE FORMAT
export async function convertImage(file, targetFormat, quality = 0.9) {
  validateFileSize(file, IMAGE_MAX_SIZE);
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error('Conversion failed'));
      else resolve(blob);
    }, targetFormat, quality);
  });
}

// RESIZE IMAGE
export async function resizeImage(file, options = {}) {
  validateFileSize(file, IMAGE_MAX_SIZE);
  const { width, height, maintainAspectRatio = true, format = file.type || 'image/png', quality = 0.9 } = options;

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');

  let targetW = width || img.naturalWidth;
  let targetH = height || img.naturalHeight;

  if (maintainAspectRatio) {
    const origRatio = img.naturalWidth / img.naturalHeight;
    if (width && !height) {
      targetH = Math.round(width / origRatio);
    } else if (height && !width) {
      targetW = Math.round(height * origRatio);
    } else if (width && height) {
      const scaleW = width / img.naturalWidth;
      const scaleH = height / img.naturalHeight;
      const scale = Math.min(scaleW, scaleH);
      targetW = Math.round(img.naturalWidth * scale);
      targetH = Math.round(img.naturalHeight * scale);
    }
  }

  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  // Use high-quality downscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error('Resize failed'));
      else resolve({ blob, width: targetW, height: targetH });
    }, format, quality);
  });
}

// COMPRESS IMAGE
export async function compressImage(file, targetQuality = 0.7, maxDimensionPx = 2048) {
  validateFileSize(file, IMAGE_MAX_SIZE);
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');

  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (w > maxDimensionPx || h > maxDimensionPx) {
    const scale = maxDimensionPx / Math.max(w, h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const outputFormat = file.type === 'image/png' && targetQuality > 0.85 ? 'image/png' : 'image/jpeg';
  if (outputFormat === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error('Compression failed'));
      else resolve({ blob, width: w, height: h, format: outputFormat });
    }, outputFormat, targetQuality);
  });
}

export function getImageExtension(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
  };
  return map[mimeType] || 'png';
}

export function stripExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}
