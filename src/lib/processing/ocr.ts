// ============================================
// OCR SERVICE (using Tesseract.js)
// ============================================

export async function performOcr(imageBuffer: Buffer): Promise<{
  text: string;
  confidence: number;
}> {
  const Tesseract = await import('tesseract.js');
  
  const worker = await Tesseract.createWorker('eng');
  
  try {
    const { data } = await worker.recognize(imageBuffer);
    
    return {
      text: data.text,
      confidence: data.confidence,
    };
  } finally {
    await worker.terminate();
  }
}
