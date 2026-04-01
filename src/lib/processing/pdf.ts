import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';

// ============================================
// PDF PROCESSING SERVICE
// ============================================

export async function imageToPdf(imageBuffers: Buffer[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  for (const imgBuffer of imageBuffers) {
    const metadata = await sharp(imgBuffer).metadata();
    const width = metadata.width || 595;
    const height = metadata.height || 842;

    // Convert to PNG for embedding
    const pngBuffer = await sharp(imgBuffer).png().toBuffer();

    const image = await pdfDoc.embedPng(pngBuffer);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function textToPdf(text: string, options?: {
  fontSize?: number;
  title?: string;
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = options?.fontSize || 12;
  const margin = 50;
  const lineHeight = fontSize * 1.5;

  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - 2 * margin;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title
  if (options?.title) {
    page.drawText(options.title, {
      x: margin,
      y,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 40;
  }

  // Split text into lines
  const words = text.split(/\s+/);
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(currentLine, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    page.drawText(currentLine, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function mergePdfs(pdfBuffers: Buffer[]): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return Buffer.from(pdfBytes);
}

export async function splitPdf(
  pdfBuffer: Buffer,
  options?: { pageRange?: string }
): Promise<Buffer[]> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const results: Buffer[] = [];

  if (options?.pageRange) {
    // Parse page range like "1-3,5,7-9"
    const ranges = options.pageRange.split(',');
    for (const range of ranges) {
      const [start, end] = range.trim().split('-').map(Number);
      const newPdf = await PDFDocument.create();
      const startIdx = (start || 1) - 1;
      const endIdx = end ? end - 1 : startIdx;

      for (let i = startIdx; i <= Math.min(endIdx, totalPages - 1); i++) {
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
      }

      results.push(Buffer.from(await newPdf.save()));
    }
  } else {
    // Split into individual pages
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      results.push(Buffer.from(await newPdf.save()));
    }
  }

  return results;
}

export async function compressPdf(pdfBuffer: Buffer): Promise<Buffer> {
  const pdf = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  });

  // Remove metadata to reduce size
  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('File Lab');
  pdf.setCreator('File Lab');

  const pdfBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return Buffer.from(pdfBytes);
}
