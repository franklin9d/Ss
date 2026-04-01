import { marked } from 'marked';
import { textToPdf } from './pdf';

// ============================================
// DOCUMENT PROCESSING SERVICE
// ============================================

export async function markdownToPdf(markdownContent: string): Promise<Buffer> {
  // Convert markdown to plain text for PDF
  const htmlContent = await marked(markdownContent);
  
  // Strip HTML tags for simple text PDF
  const textContent = htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  return textToPdf(textContent, { fontSize: 12 });
}

export async function wordToPdf(docBuffer: Buffer): Promise<Buffer> {
  // Extract text from DOCX using mammoth
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer: docBuffer });
  const text = result.value;

  return textToPdf(text, { fontSize: 12 });
}

export async function extractTextFromDoc(docBuffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer: docBuffer });
  return result.value;
}
