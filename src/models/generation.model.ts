import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGenerationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: "blog" | "email" | "code" | "image-prompt";
  title: string;
  prompt: string;
  output: string;
  metadata: {
    tone?: string;
    keywords?: string[];
    wordCount?: number;
    emailType?: string;
    language?: string;
    action?: string;
    category?: string;
    style?: string;
    mood?: string;
    model?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GenerationSchema = new Schema<IGenerationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["blog", "email", "code", "image-prompt"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    metadata: {
      tone: String,
      keywords: [String],
      wordCount: Number,
      emailType: String,
      language: String,
      action: String,
      category: String,
      style: String,
      mood: String,
      model: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
GenerationSchema.index({ userId: 1, type: 1, createdAt: -1 });
GenerationSchema.index({ userId: 1, createdAt: -1 });

const Generation: Model<IGenerationDocument> =
  mongoose.models.Generation ||
  mongoose.model<IGenerationDocument>("Generation", GenerationSchema);

export default Generation;
