import PptxGenJS from 'pptxgenjs';
import { validateFileSize } from './pdfUtils';

export const IMAGE_MAX_SIZE = 20 * 1024 * 1024;

// COLOR THEMES
export const THEMES = {
  dark: {
    bg: '1a1a2e', title: 'e94560', body: 'ffffff', accent: '16213e',
    titleFont: 'Arial', bodyFont: 'Arial',
  },
  corporate: {
    bg: 'ffffff', title: '1a365d', body: '2d3748', accent: '3182ce',
    titleFont: 'Calibri', bodyFont: 'Calibri',
  },
  minimal: {
    bg: 'fafafa', title: '111111', body: '444444', accent: 'ff5c35',
    titleFont: 'Georgia', bodyFont: 'Arial',
  },
  vibrant: {
    bg: '0f0c29', title: 'ff6b6b', body: 'eeeeee', accent: '302b63',
    titleFont: 'Impact', bodyFont: 'Arial',
  },
};

// TEXT TO PPT
export async function textToPpt(slides, options = {}) {
  const { theme = 'minimal', includeSlideNumbers = true } = options;
  const colors = THEMES[theme] || THEMES.minimal;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.defineLayout({ name: 'LAYOUT_WIDE', width: 13.33, height: 7.5 });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const pSlide = pptx.addSlide();

    // Background
    pSlide.background = { color: colors.bg };

    // Accent bar
    pSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 0.08, h: 7.5,
      fill: { color: colors.title }, line: { color: colors.title },
    });

    // Title
    if (slide.title) {
      pSlide.addText(slide.title, {
        x: 0.4, y: 0.4, w: 12.5, h: 1.0,
        fontSize: 32, bold: true, color: colors.title,
        fontFace: colors.titleFont, valign: 'top',
      });
    }

    // Divider
    pSlide.addShape(pptx.ShapeType.line, {
      x: 0.4, y: 1.4, w: 12.5, h: 0,
      line: { color: colors.title, width: 1, dashType: 'solid' },
    });

    // Body
    if (slide.content) {
      const bullets = slide.content.split('\n').filter(l => l.trim());
      const textArr = bullets.map(b => ({
        text: b.replace(/^[-•*]\s*/, ''),
        options: { bullet: b.match(/^[-•*]/) ? { type: 'bullet' } : false, breakLine: true },
      }));

      pSlide.addText(textArr, {
        x: 0.4, y: 1.6, w: 12.5, h: 5.4,
        fontSize: 18, color: colors.body,
        fontFace: colors.bodyFont,
        valign: 'top', lineSpacingMultiple: 1.4,
      });
    }

    // Slide number
    if (includeSlideNumbers) {
      pSlide.addText(`${i + 1} / ${slides.length}`, {
        x: 11.5, y: 7.1, w: 1.5, h: 0.3,
        fontSize: 9, color: `${colors.body}66`,
        align: 'right', fontFace: 'Arial',
      });
    }
  }

  const blob = await pptx.write({ outputType: 'blob' });
  return blob;
}

// IMAGE TO PPT
export async function imageToPpt(files, options = {}) {
  const { theme = 'dark', layout = 'one-per-slide', title = '' } = options;
  const colors = THEMES[theme] || THEMES.dark;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';

  // Convert files to data URLs
  const imageDataList = await Promise.all(files.map(f => fileToDataUrl(f)));

  if (layout === 'one-per-slide') {
    for (let i = 0; i < files.length; i++) {
      validateFileSize(files[i], IMAGE_MAX_SIZE);
      const pSlide = pptx.addSlide();
      pSlide.background = { color: colors.bg };

      const fileName = files[i].name.replace(/\.[^/.]+$/, '');

      pSlide.addImage({
        data: imageDataList[i],
        x: 0.5, y: 0.5, w: 12.33, h: 5.8,
        sizing: { type: 'contain', w: 12.33, h: 5.8 },
      });

      if (title || fileName) {
        pSlide.addText(fileName, {
          x: 0.5, y: 6.5, w: 12.33, h: 0.5,
          fontSize: 12, color: `${colors.body}99`,
          align: 'center', fontFace: 'Arial',
        });
      }
    }
  } else {
    // Grid layout: 4 per slide
    const perPage = 4;
    for (let page = 0; page < Math.ceil(files.length / perPage); page++) {
      const pSlide = pptx.addSlide();
      pSlide.background = { color: colors.bg };
      const pageFiles = files.slice(page * perPage, (page + 1) * perPage);

      pageFiles.forEach((f, idx) => {
        validateFileSize(f, IMAGE_MAX_SIZE);
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 0.3 + col * 6.55;
        const y = 0.3 + row * 3.55;
        pSlide.addImage({
          data: imageDataList[page * perPage + idx],
          x, y, w: 6.2, h: 3.2,
          sizing: { type: 'contain', w: 6.2, h: 3.2 },
        });
      });
    }
  }

  if (title) {
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: colors.bg };
    titleSlide.addText(title, {
      x: 1, y: 2.5, w: 11.33, h: 2,
      fontSize: 48, bold: true, color: colors.title,
      align: 'center', fontFace: colors.titleFont,
    });
    // Move title slide to front (pptxgenjs adds slides in order, workaround: regenerate)
  }

  const blob = await pptx.write({ outputType: 'blob' });
  return blob;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function parseSlides(text) {
  // Split on ---  or ## headers
  const slides = [];
  const sections = text.split(/\n---\n|^##\s/m).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const title = lines[0].replace(/^#+ /, '').trim();
    const content = lines.slice(1).join('\n').trim();
    slides.push({ title, content });
  }

  if (slides.length === 0 && text.trim()) {
    slides.push({ title: 'Slide 1', content: text.trim() });
  }

  return slides;
}
