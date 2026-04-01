// ============================================
// ALL-IN-ONE FILE LAB - Type Definitions
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PRO';
  createdAt: string;
  usage: {
    today: number;
    limit: number;
    bytesUsed: number;
  };
}

export interface FileProcessingRequest {
  operation: FileOperation;
  options?: Record<string, unknown>;
}

export type FileOperation =
  | 'IMAGE_TO_PDF'
  | 'TEXT_TO_PDF'
  | 'MERGE_PDF'
  | 'SPLIT_PDF'
  | 'COMPRESS_PDF'
  | 'IMAGE_CONVERT'
  | 'IMAGE_RESIZE'
  | 'IMAGE_COMPRESS'
  | 'VIDEO_CONVERT'
  | 'AUDIO_EXTRACT'
  | 'WORD_TO_PDF'
  | 'MARKDOWN_TO_PDF'
  | 'ZIP_CREATE'
  | 'ZIP_EXTRACT'
  | 'OCR';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  operation: FileOperation;
  acceptedTypes: string[];
  maxFiles: number;
  category: 'pdf' | 'images' | 'media' | 'docs' | 'utilities';
}

export interface UsageStats {
  totalFiles: number;
  totalSize: number;
  todayCount: number;
  dailyLimit: number;
}

export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  totalFiles: number;
  totalRevenue: number;
  recentActivity: ActivityItem[];
  dailyStats: DailyStat[];
}

export interface ActivityItem {
  id: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  createdAt: string;
}

export interface DailyStat {
  date: string;
  users: number;
  files: number;
  revenue: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    dailyConversions: number | 'unlimited';
    maxFileSize: string;
    priority: string;
  };
  popular?: boolean;
  stripePriceId?: string;
}
