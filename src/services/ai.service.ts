import openai, { OPENAI_MODEL } from "@/lib/openai";
import type {
  BlogGenerationRequest,
  EmailGenerationRequest,
  CodeGenerationRequest,
  ImagePromptRequest,
} from "@/types/ai.types";

// =========================
// DEMO MODE SWITCH
// =========================

const DEMO_MODE = process.env.OPENAI_DEMO_MODE === "true";

// =========================
// System Prompts
// =========================

const BLOG_SYSTEM_PROMPT = `You are an expert SEO content writer...`;
const EMAIL_SYSTEM_PROMPT = `You are a professional email writing assistant...`;
const CODE_SYSTEM_PROMPT = `You are an expert software developer...`;
const IMAGE_PROMPT_SYSTEM_PROMPT = `You are an expert AI image prompt engineer...`;

// =========================
// HELPERS (DEMO CONTENT)
// =========================

function demoBlog(input: BlogGenerationRequest) {
  return `
# ${input.topic}

## Introduction
This is a demo blog post generated without OpenAI.

## Content
- Tone: ${input.tone}
- Word Count Target: ${input.wordCount}
- Keywords: ${input.keywords.join(", ")}

## Main Points
- AI improves productivity
- AI automates workflows
- AI enhances decision-making

## Conclusion
This is demo content for development mode.
`;
}

function demoEmail(input: EmailGenerationRequest) {
  return `
Subject: Demo ${input.emailType} Email

Hello ${input.recipientName || "Team"},

This is a demo email generated in development mode.

Context: ${input.prompt}

Regards,
${input.senderName || "AI System"}
`;
}

function demoCode(input: CodeGenerationRequest) {
  return `\`\`\`${input.language}
${input.action === "generate"
    ? `// Demo generated code\nexport default function Demo() {\n  return "Hello World";\n}`
    : `// Demo ${input.action} output\n// This is simulated response`}
\`\`\``;
}

function demoImagePrompt(input: ImagePromptRequest) {
  return `
1. ${input.subject} in ${input.style} style, ${input.mood} mood, cinematic lighting, ultra-detailed.

2. Futuristic ${input.category} scene with ${input.subject}, dramatic lighting, wide angle view.

3. High quality AI artwork of ${input.subject}, ${input.style} style, professional composition.
`;
}

// =========================
// GENERATION FUNCTIONS
// =========================

// BLOG
export async function generateBlog(input: BlogGenerationRequest): Promise<string> {
  if (DEMO_MODE) return demoBlog(input);

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

// EMAIL
export async function generateEmail(input: EmailGenerationRequest): Promise<string> {
  if (DEMO_MODE) return demoEmail(input);

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

// CODE
export async function generateCode(input: CodeGenerationRequest): Promise<string> {
  if (DEMO_MODE) return demoCode(input);

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

// IMAGE PROMPT
export async function generateImagePrompt(input: ImagePromptRequest): Promise<string> {
  if (DEMO_MODE) return demoImagePrompt(input);

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

// =========================
// STREAMING (DEMO SAFE)
// =========================

export async function generateBlogStream(input: BlogGenerationRequest) {
  if (DEMO_MODE) {
    return demoBlog(input);
  }

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: BLOG_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Write a ${input.wordCount}-word blog post about "${input.topic}" in a ${input.tone} tone.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    stream: true,
  });
}

export async function generateEmailStream(input: EmailGenerationRequest) {
  if (DEMO_MODE) return demoEmail(input);

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: EMAIL_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Write a ${input.emailType} email in a ${input.tone} tone.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    stream: true,
  });
}

export async function generateCodeStream(input: CodeGenerationRequest) {
  if (DEMO_MODE) return demoCode(input);

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: CODE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `${input.action} the following in ${input.language}:\n\n${input.prompt}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 4000,
    stream: true,
  });
}

export async function generateImagePromptStream(input: ImagePromptRequest) {
  if (DEMO_MODE) return demoImagePrompt(input);

  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: IMAGE_PROMPT_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate 3 prompts for ${input.subject} in ${input.style} style`,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
    stream: true,
  });
}