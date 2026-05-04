// Central SEO metadata for all tools and pages
export const SITE = {
  name: 'Nexvert',
  domain: 'https://nexvert.app', // ← replace with your domain
  tagline: 'Free Online PDF, Image & PowerPoint Tools',
  description:
    'Nexvert offers free, private, client-side tools for PDF editing, image conversion, and PowerPoint generation. No uploads, no servers — everything runs in your browser.',
  twitterHandle: '@nexvertapp', // ← replace or remove
  ogImage: '/og-image.png', // ← add a 1200×630 image to /public
};

export const TOOL_META = {
  // PDF
  'text-to-pdf': {
    title: 'Text to PDF Converter — Free Online Tool',
    description:
      'Convert plain text or documents to PDF instantly. Choose font, size, page format (A4, Letter) and download — no signup, no upload, 100% private.',
    keywords: 'text to pdf, convert text to pdf, txt to pdf, free pdf converter, online pdf maker',
    h1: 'Text to PDF Converter',
    faq: [
      { q: 'Is this text to PDF converter free?', a: 'Yes, completely free with no limits.' },
      { q: 'Do you store my text?', a: 'No. Everything runs in your browser — your content never leaves your device.' },
      { q: 'What page sizes are supported?', a: 'A4, A3, and US Letter.' },
    ],
  },
  'image-to-pdf': {
    title: 'Image to PDF Converter — JPG/PNG to PDF Free',
    description:
      'Convert JPG, PNG, WEBP images to PDF in seconds. Batch convert multiple images into a single PDF with customisable page size, orientation, and margins.',
    keywords: 'image to pdf, jpg to pdf, png to pdf, webp to pdf, convert photo to pdf, batch image pdf',
    h1: 'Image to PDF Converter',
    faq: [
      { q: 'Can I convert multiple images at once?', a: 'Yes — drag and drop multiple images and they all become pages in one PDF.' },
      { q: 'What image formats are supported?', a: 'JPG, PNG, WEBP, GIF, and BMP.' },
    ],
  },
  'html-to-pdf': {
    title: 'HTML to PDF Converter — Free Online',
    description:
      'Convert HTML markup to a downloadable PDF file. Paste your HTML, choose the page size, and download — no browser extensions required.',
    keywords: 'html to pdf, convert html to pdf, webpage to pdf, html pdf generator',
    h1: 'HTML to PDF Converter',
    faq: [
      { q: 'Does it support CSS styles?', a: 'Basic inline styles are supported. Complex CSS layouts may not render perfectly as this is a client-side tool.' },
    ],
  },
  'merge-pdf': {
    title: 'Merge PDF Files Online — Free PDF Combiner',
    description:
      'Combine multiple PDF files into one. Drag to reorder pages, then download your merged PDF — fast, free, and private.',
    keywords: 'merge pdf, combine pdf, pdf merger, join pdf files, merge pdf online free',
    h1: 'Merge PDF Files',
    faq: [
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'No hard limit — but very large files may be slow depending on your device.' },
      { q: 'Can I reorder pages before merging?', a: 'Yes. Use the up/down arrows to reorder files before merging.' },
    ],
  },
  'split-pdf': {
    title: 'Split PDF Online — Extract Pages Free',
    description:
      'Split a PDF into multiple files. Extract specific page ranges or split every page into its own PDF — all without uploading to any server.',
    keywords: 'split pdf, extract pdf pages, pdf splitter, divide pdf, separate pdf pages online',
    h1: 'Split PDF',
    faq: [
      { q: 'Can I extract a specific range of pages?', a: 'Yes — define one or more custom ranges (e.g. pages 3–7) and download each as a separate PDF.' },
      { q: 'Can I split every page into its own file?', a: 'Yes, use the "Every Page" mode to get one PDF per page.' },
    ],
  },
  // Image
  'convert-image': {
    title: 'Image Converter — JPG, PNG, WEBP Converter Free',
    description:
      'Convert images between JPG, PNG, and WEBP formats in your browser. Batch convert multiple files and control output quality — no account needed.',
    keywords: 'image converter, jpg to png, png to jpg, webp to jpg, convert image format, online image converter',
    h1: 'Image Format Converter',
    faq: [
      { q: 'Can I convert multiple images at once?', a: 'Yes — select or drag multiple images and they will all be converted in one click.' },
      { q: 'Does converting to JPG affect quality?', a: 'JPG is lossy. Use the quality slider (default 90%) to balance file size and quality.' },
    ],
  },
  'resize-image': {
    title: 'Resize Image Online — Free Image Resizer',
    description:
      'Resize images to exact pixel dimensions. Batch resize JPG, PNG, and WEBP files. Includes social media presets for Twitter, Instagram, and more.',
    keywords: 'resize image, image resizer, resize photo online, change image size, resize jpg png webp',
    h1: 'Image Resizer',
    faq: [
      { q: 'Will resizing distort my image?', a: 'No — aspect ratio is maintained by default. Uncheck the option to force exact dimensions.' },
      { q: 'Are there social media size presets?', a: 'Yes — including Twitter (1200×675), Instagram (1080×1080), HD, FHD, and thumbnails.' },
    ],
  },
  'compress-image': {
    title: 'Compress Image Online — Reduce Image File Size Free',
    description:
      'Reduce image file size without visible quality loss. Compress JPG, PNG, and WEBP files in bulk with a quality slider and max-dimension control.',
    keywords: 'compress image, reduce image size, image compressor, shrink photo, optimize image, jpg png compressor',
    h1: 'Image Compressor',
    faq: [
      { q: 'How much can I reduce file size?', a: 'Typically 40–80% depending on the original image and your chosen quality setting.' },
      { q: 'Will my image lose quality?', a: 'At 70–90% quality the difference is usually imperceptible. Use the slider to find the right balance.' },
    ],
  },
  // PPT
  'text-to-ppt': {
    title: 'Text to PowerPoint Generator — Free Online PPT Maker',
    description:
      'Generate a PowerPoint presentation from plain text. Separate slides with "---", pick a theme, and download a .pptx file — no PowerPoint required.',
    keywords: 'text to powerpoint, text to ppt, ppt generator, create powerpoint online, free pptx maker',
    h1: 'Text to PowerPoint Generator',
    faq: [
      { q: 'What format should my text be in?', a: 'Separate slides with "---" on its own line. The first line of each section becomes the slide title.' },
      { q: 'Can I open the file in Google Slides?', a: 'Yes — .pptx files are compatible with Google Slides, LibreOffice, and Keynote.' },
    ],
  },
  'image-to-ppt': {
    title: 'Images to PowerPoint — Free Photo Slideshow Maker',
    description:
      'Turn photos into a PowerPoint slideshow. Upload images, choose a layout (one per slide or grid), pick a theme, and download a .pptx file.',
    keywords: 'images to powerpoint, photo slideshow ppt, image to pptx, pictures to presentation, photo to powerpoint',
    h1: 'Images to PowerPoint Slideshow',
    faq: [
      { q: 'How many images can I add?', a: 'There is no hard limit — though very large batches may be slower on lower-end devices.' },
      { q: 'What layout options are available?', a: 'One image per slide (full-screen) or a 4-up grid layout.' },
    ],
  },
};

// Category-level meta for the landing sections
export const CATEGORY_META = {
  pdf: {
    title: 'Free Online PDF Tools — No Upload Required',
    description: 'Convert, merge, split, and create PDFs entirely in your browser. Fast, free, and 100% private.',
    keywords: 'pdf tools, free pdf tools, online pdf editor, pdf converter, pdf merger, pdf splitter',
  },
  image: {
    title: 'Free Online Image Tools — Convert, Resize, Compress',
    description: 'Batch convert, resize, and compress images in your browser. Supports JPG, PNG, and WEBP.',
    keywords: 'image tools, free image converter, online image resizer, image compressor, photo tools',
  },
  ppt: {
    title: 'Free Online PowerPoint Tools — Create PPT Online',
    description: 'Generate PowerPoint presentations from text or images entirely in your browser. Download .pptx instantly.',
    keywords: 'powerpoint tools, free ppt maker, online presentation creator, pptx generator',
  },
};
