// ============ User Types ============
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// ============ Generation Types ============
export type GenerationType = "blog" | "email" | "code" | "image-prompt";

export interface IGeneration {
  _id: string;
  userId: string;
  type: GenerationType;
  title: string;
  prompt: string;
  output: string;
  metadata: GenerationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationMetadata {
  tone?: string;
  keywords?: string[];
  wordCount?: number;
  emailType?: string;
  language?: string;
  action?: string;
  category?: string;
  style?: string;
  model?: string;
}

// ============ History Types ============
export interface IHistory {
  _id: string;
  userId: string;
  generationId: string;
  generation?: IGeneration;
  action: "created" | "viewed" | "copied" | "exported" | "deleted";
  createdAt: Date;
}

// ============ Settings Types ============
export interface ISettings {
  _id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  defaultTone: string;
  defaultLanguage: string;
  apiUsage: {
    totalRequests: number;
    lastResetDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============ Dashboard Types ============
export interface DashboardStats {
  totalGenerations: number;
  thisMonthGenerations: number;
  totalBlogs: number;
  totalEmails: number;
  totalCode: number;
  totalImagePrompts: number;
}

export interface ActivityData {
  date: string;
  blogs: number;
  emails: number;
  code: number;
  imagePrompts: number;
}

// ============ Navigation Types ============
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  totalItems?: number;
  page?: number;
  limit?: number;
}
