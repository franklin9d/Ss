import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters')
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required').max(128),
});

export const fileUploadSchema = z.object({
  operation: z.enum([
    'IMAGE_TO_PDF',
    'TEXT_TO_PDF',
    'MERGE_PDF',
    'SPLIT_PDF',
    'COMPRESS_PDF',
    'IMAGE_CONVERT',
    'IMAGE_RESIZE',
    'IMAGE_COMPRESS',
    'VIDEO_CONVERT',
    'AUDIO_EXTRACT',
    'WORD_TO_PDF',
    'MARKDOWN_TO_PDF',
    'ZIP_CREATE',
    'ZIP_EXTRACT',
    'OCR',
  ]),
  options: z.record(z.string(), z.unknown()).optional(),
});

// ============================================
// SANITIZATION
// ============================================

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

// ============================================
// FILE VALIDATION
// ============================================

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'],
  video: ['video/mp4', 'video/avi', 'video/quicktime', 'video/webm', 'video/x-msvideo'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
  document: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown',
    'text/plain',
  ],
  archive: ['application/zip', 'application/x-zip-compressed'],
};

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  pdf: ['.pdf'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.tif'],
  video: ['.mp4', '.avi', '.mov', '.webm'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a'],
  document: ['.doc', '.docx', '.md', '.txt'],
  archive: ['.zip'],
};

export function getFileCategory(operation: string): string {
  const mapping: Record<string, string> = {
    IMAGE_TO_PDF: 'image',
    TEXT_TO_PDF: 'document',
    MERGE_PDF: 'pdf',
    SPLIT_PDF: 'pdf',
    COMPRESS_PDF: 'pdf',
    IMAGE_CONVERT: 'image',
    IMAGE_RESIZE: 'image',
    IMAGE_COMPRESS: 'image',
    VIDEO_CONVERT: 'video',
    AUDIO_EXTRACT: 'video',
    WORD_TO_PDF: 'document',
    MARKDOWN_TO_PDF: 'document',
    ZIP_CREATE: 'archive',
    ZIP_EXTRACT: 'archive',
    OCR: 'image',
  };
  return mapping[operation] || 'document';
}

export function validateFileType(
  fileName: string,
  mimeType: string,
  operation: string
): { valid: boolean; error?: string } {
  const category = getFileCategory(operation);
  const allowedMimes = ALLOWED_MIME_TYPES[category] || [];
  const allowedExts = ALLOWED_EXTENSIONS[category] || [];

  const ext = '.' + fileName.split('.').pop()?.toLowerCase();

  if (!allowedExts.includes(ext)) {
    return { valid: false, error: `File extension ${ext} is not allowed for this operation` };
  }

  if (!allowedMimes.includes(mimeType)) {
    return { valid: false, error: `File type ${mimeType} is not allowed for this operation` };
  }

  return { valid: true };
}

export function validateFileSize(
  size: number,
  plan: 'FREE' | 'PRO'
): { valid: boolean; error?: string } {
  const maxSize =
    plan === 'PRO'
      ? parseInt(process.env.MAX_FILE_SIZE_PRO || '104857600')
      : parseInt(process.env.MAX_FILE_SIZE_FREE || '10485760');

  if (size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds ${maxMB}MB limit for ${plan} plan`,
    };
  }

  return { valid: true };
}

// ============================================
// DANGEROUS FILE CHECK
// ============================================

const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.inf', '.iqy',
  '.js', '.jse', '.lnk', '.msi', '.msp', '.mst',
  '.pif', '.ps1', '.reg', '.rgs', '.scr', '.sct',
  '.shb', '.shs', '.vb', '.vbe', '.vbs', '.wsc',
  '.wsf', '.wsh', '.ws', '.php', '.asp', '.aspx',
  '.sh', '.cgi', '.py', '.pl', '.rb',
];

export function isDangerousFile(fileName: string): boolean {
  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  return DANGEROUS_EXTENSIONS.includes(ext);
}

// ============================================
// VIRUS SCAN SIMULATION
// ============================================

export async function scanFileForVirus(
  _buffer: Buffer,
  fileName: string
): Promise<{ safe: boolean; threat?: string }> {
  // In production, integrate with ClamAV or VirusTotal API
  // This is a hook/simulation for the scanning interface

  if (isDangerousFile(fileName)) {
    return { safe: false, threat: 'Potentially dangerous file type detected' };
  }

  // Check for known malicious signatures (simplified)
  // In production, use a real antivirus engine
  return { safe: true };
}
