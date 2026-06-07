// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

// export default openai;


import OpenAI from "openai";

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export const isDemoMode =
  process.env.OPENAI_DEMO_MODE === "true";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
});

export default openai;