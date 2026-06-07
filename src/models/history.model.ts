import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistoryDocument extends Document {
  userId: mongoose.Types.ObjectId;
  generationId: mongoose.Types.ObjectId;
  action: "created" | "viewed" | "copied" | "exported" | "deleted";
  createdAt: Date;
}

const HistorySchema = new Schema<IHistoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    generationId: {
      type: Schema.Types.ObjectId,
      ref: "Generation",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "viewed", "copied", "exported", "deleted"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

HistorySchema.index({ userId: 1, createdAt: -1 });

const History: Model<IHistoryDocument> =
  mongoose.models.History ||
  mongoose.model<IHistoryDocument>("History", HistorySchema);

export default History;
