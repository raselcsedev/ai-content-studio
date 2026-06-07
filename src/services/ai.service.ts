import openai, { OPENAI_MODEL } from "@/lib/openai";
import type {
  BlogGenerationRequest,
  EmailGenerationRequest,
  CodeGenerationRequest,
  ImagePromptRequest,
} from "@/types/ai.types";

// ============ System Prompts ============

const BLOG_SYSTEM_PROMPT = `You are an expert SEO content writer. Generate a well-structured, engaging, and SEO-optimized blog post based on the user's input. 
Include:
- A compelling title (prefixed with "# ")
- An engaging introduction
- Well-organized sections with H2/H3 headings
- Bullet points and lists where appropriate
- A strong conclusion with a call to action
- Natural keyword integration
Format the output in clean Markdown.`;

const EMAIL_SYSTEM_PROMPT = `You are a professional email writing assistant. Generate well-crafted, professional emails based on the user's requirements.
Include:
- Appropriate greeting
- Clear and concise body
- Professional tone matching the selected type
- Proper sign-off
Format the output in clean text with proper line breaks.`;

const CODE_SYSTEM_PROMPT = `You are an expert software developer and coding assistant. Based on the user's request:
- For "generate": Write clean, well-commented, production-ready code
- For "explain": Provide a detailed explanation of the code with inline comments
- For "debug": Identify bugs and provide fixed code with explanations
- For "refactor": Improve the code structure, readability, and performance
Always include code in proper markdown code blocks with language specification.`;

const IMAGE_PROMPT_SYSTEM_PROMPT = `You are an expert AI image prompt engineer. Generate detailed, high-quality prompts for AI image generators like Midjourney, DALL-E, and Stable Diffusion.
For each request, generate 3 different prompt variations.
Each prompt should include:
- Detailed scene description
- Lighting details
- Camera angle/perspective
- Style modifiers
- Quality tags
Format each prompt with a numbered heading and the full prompt text.`;

// ============ Generation Functions ============

export async function generateBlog(input: BlogGenerationRequest): Promise<string> {
  const userPrompt = `Write a ${input.wordCount}-word blog post about "${input.topic}" in a ${input.tone} tone.${
    input.keywords.length > 0
      ? ` Incorporate these keywords naturally: ${input.keywords.join(", ")}.`
      : ""
  }`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: BLOG_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content || "Failed to generate content.";
}

export async function generateEmail(input: EmailGenerationRequest): Promise<string> {
  const userPrompt = `Write a ${input.emailType} email in a ${input.tone} tone.
Context: ${input.prompt}${input.recipientName ? `\nRecipient: ${input.recipientName}` : ""}${
    input.senderName ? `\nSender: ${input.senderName}` : ""
  }`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: EMAIL_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content || "Failed to generate email.";
}

export async function generateCode(input: CodeGenerationRequest): Promise<string> {
  const actionMap = {
    generate: "Generate",
    explain: "Explain",
    debug: "Debug and fix",
    refactor: "Refactor and improve",
  };

  const userPrompt = `${actionMap[input.action]} the following in ${input.language}:\n\n${input.prompt}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: CODE_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content || "Failed to generate code.";
}

export async function generateImagePrompt(input: ImagePromptRequest): Promise<string> {
  const userPrompt = `Generate 3 detailed AI image prompts for:
Subject: ${input.subject}
Category: ${input.category}
Style: ${input.style}
Mood: ${input.mood}${input.details ? `\nAdditional details: ${input.details}` : ""}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: IMAGE_PROMPT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content || "Failed to generate prompts.";
}

// ============ Streaming Generation ============

export async function generateBlogStream(input: BlogGenerationRequest) {
  const userPrompt = `Write a ${input.wordCount}-word blog post about "${input.topic}" in a ${input.tone} tone.${
    input.keywords.length > 0
      ? ` Incorporate these keywords naturally: ${input.keywords.join(", ")}.`
      : ""
  }`;

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: BLOG_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    stream: true,
  });
}

export async function generateEmailStream(input: EmailGenerationRequest) {
  const userPrompt = `Write a ${input.emailType} email in a ${input.tone} tone.
Context: ${input.prompt}${input.recipientName ? `\nRecipient: ${input.recipientName}` : ""}${
    input.senderName ? `\nSender: ${input.senderName}` : ""
  }`;

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: EMAIL_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    stream: true,
  });
}

export async function generateCodeStream(input: CodeGenerationRequest) {
  const actionMap = {
    generate: "Generate",
    explain: "Explain",
    debug: "Debug and fix",
    refactor: "Refactor and improve",
  };

  const userPrompt = `${actionMap[input.action]} the following in ${input.language}:\n\n${input.prompt}`;

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: CODE_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    max_tokens: 4000,
    stream: true,
  });
}

export async function generateImagePromptStream(input: ImagePromptRequest) {
  const userPrompt = `Generate 3 detailed AI image prompts for:
Subject: ${input.subject}
Category: ${input.category}
Style: ${input.style}
Mood: ${input.mood}${input.details ? `\nAdditional details: ${input.details}` : ""}`;

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: IMAGE_PROMPT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
    stream: true,
  });
}
