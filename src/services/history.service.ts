import dbConnect from "@/lib/db";
import Generation, { IGenerationDocument } from "@/models/generation.model";
import History from "@/models/history.model";
import type { GenerationType } from "@/types";

interface CreateGenerationInput {
  userId: string;
  type: GenerationType;
  title: string;
  prompt: string;
  output: string;
  metadata?: Record<string, any>;
}

interface GetHistoryParams {
  userId: string;
  type?: GenerationType;
  search?: string;
  page?: number;
  limit?: number;
}

export async function createGeneration(input: CreateGenerationInput) {
  await dbConnect();

  const generation = await Generation.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    prompt: input.prompt,
    output: input.output,
    metadata: input.metadata || {},
  });

  // Create history entry
  await History.create({
    userId: input.userId,
    generationId: generation._id,
    action: "created",
  });

  return generation;
}

export async function getGenerations(params: GetHistoryParams) {
  // Test mode - return mock data without DB
  if (process.env.NEXTAUTH_TEST_MODE === "true") {
    const mockItems: IGenerationDocument[] = [
      {
        _id: "mock-1" as any,
        userId: params.userId as any,
        type: "blog",
        title: "Getting Started with React Hooks",
        prompt: "Write about React Hooks best practices",
        output: "Comprehensive guide to React Hooks...",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "mock-2" as any,
        userId: params.userId as any,
        type: "email",
        title: "Newsletter for June",
        prompt: "Create a weekly newsletter",
        output: "Here's your weekly newsletter content...",
        metadata: {},
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
      },
    ];
    return {
      items: mockItems,
      total: mockItems.length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    };
  }

  await dbConnect();

  const { userId, type, search, page = 1, limit = 10 } = params;

  const query: Record<string, any> = { userId };

  if (type) {
    query.type = type;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { prompt: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Generation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IGenerationDocument>(),
    Generation.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getGenerationById(
  generationId: string,
  userId: string
): Promise<IGenerationDocument | null> {
  await dbConnect();
  return Generation.findOne({ _id: generationId, userId }).lean<IGenerationDocument>();
}

export async function deleteGeneration(
  generationId: string,
  userId: string
): Promise<boolean> {
  await dbConnect();

  const result = await Generation.deleteOne({
    _id: generationId,
    userId,
  });

  if (result.deletedCount > 0) {
    // Log deletion in history
    await History.create({
      userId,
      generationId,
      action: "deleted",
    });
    return true;
  }

  return false;
}

export async function deleteMultipleGenerations(
  generationIds: string[],
  userId: string
): Promise<number> {
  await dbConnect();

  const result = await Generation.deleteMany({
    _id: { $in: generationIds },
    userId,
  });

  return result.deletedCount;
}

export async function getRecentGenerations(
  userId: string,
  limit = 5
): Promise<IGenerationDocument[]> {
  // Test mode - return mock data without DB
  if (process.env.NEXTAUTH_TEST_MODE === "true") {
    const mockGenerations: IGenerationDocument[] = [
      {
        _id: "mock-1" as any,
        userId: userId as any,
        type: "blog",
        title: "Getting Started with React Hooks",
        prompt: "Write about React Hooks best practices",
        output: "Comprehensive guide to React Hooks...",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "mock-2" as any,
        userId: userId as any,
        type: "email",
        title: "Newsletter for June",
        prompt: "Create a weekly newsletter",
        output: "Here's your weekly newsletter content...",
        metadata: {},
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
      },
      {
        _id: "mock-3" as any,
        userId: userId as any,
        type: "code",
        title: "Authentication Middleware",
        prompt: "Write middleware for JWT auth",
        output: "export const authMiddleware = ...",
        metadata: {},
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
      },
    ];
    return mockGenerations.slice(0, limit);
  }

  await dbConnect();
  return Generation.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<IGenerationDocument[]>() as unknown as IGenerationDocument[];
}
