// ============ AI Request Types ============

export interface BlogGenerationRequest {
  topic: string;
  tone: string;
  keywords: string[];
  wordCount: number;
}

export interface EmailGenerationRequest {
  emailType: string;
  tone: string;
  prompt: string;
  recipientName?: string;
  senderName?: string;
}

export interface CodeGenerationRequest {
  prompt: string;
  language: string;
  action: "generate" | "explain" | "debug" | "refactor";
}

export interface ImagePromptRequest {
  subject: string;
  style: string;
  mood: string;
  details: string;
  category: string;
}

// ============ AI Response Types ============

export interface AIGenerationResponse {
  content: string;
  title: string;
  model: string;
  generationId?: string;
}

// ============ Streaming Types ============

export interface StreamChunk {
  content: string;
  done: boolean;
}

// ============ Constants ============

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "academic", label: "Academic" },
  { value: "creative", label: "Creative" },
  { value: "persuasive", label: "Persuasive" },
  { value: "friendly", label: "Friendly" },
] as const;

export const EMAIL_TYPE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "follow-up", label: "Follow Up" },
  { value: "cold-outreach", label: "Cold Outreach" },
  { value: "complaint", label: "Complaint" },
  { value: "thank-you", label: "Thank You" },
  { value: "introduction", label: "Introduction" },
  { value: "proposal", label: "Proposal" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML/CSS" },
] as const;

export const CODE_ACTION_OPTIONS = [
  { value: "generate", label: "Generate Code" },
  { value: "explain", label: "Explain Code" },
  { value: "debug", label: "Debug Code" },
  { value: "refactor", label: "Refactor Code" },
] as const;

export const IMAGE_STYLE_OPTIONS = [
  { value: "cinematic", label: "Cinematic" },
  { value: "photorealistic", label: "Photorealistic" },
  { value: "anime", label: "Anime" },
  { value: "watercolor", label: "Watercolor" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "digital-art", label: "Digital Art" },
  { value: "3d-render", label: "3D Render" },
  { value: "minimalist", label: "Minimalist" },
  { value: "surreal", label: "Surreal" },
  { value: "fantasy", label: "Fantasy" },
] as const;

export const IMAGE_CATEGORY_OPTIONS = [
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "abstract", label: "Abstract" },
  { value: "architecture", label: "Architecture" },
  { value: "nature", label: "Nature" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "product", label: "Product" },
  { value: "character", label: "Character" },
] as const;

export const MOOD_OPTIONS = [
  { value: "dramatic", label: "Dramatic" },
  { value: "peaceful", label: "Peaceful" },
  { value: "mysterious", label: "Mysterious" },
  { value: "vibrant", label: "Vibrant" },
  { value: "dark", label: "Dark" },
  { value: "ethereal", label: "Ethereal" },
  { value: "nostalgic", label: "Nostalgic" },
  { value: "futuristic", label: "Futuristic" },
] as const;
