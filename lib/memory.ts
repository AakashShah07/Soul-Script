import { Pinecone } from '@pinecone-database/pinecone';
import { Redis } from "@upstash/redis";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};
export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone({
      apiKey: "pcsk_6qrUV9_QWedLbPPMyiRVzBeH8u8okMC61eghUCceKskyG56EqETq2wqtdUuKR9xxLa72x1",
    });
  }

  public async init() {
    try {
      console.log("🔄 Checking Pinecone connection...");

      const indexes = await this.vectorDBClient.listIndexes();
      // console.log("Available Indexes:", indexes);

      if (!indexes.indexes.some((idx) => idx.name === "companion")) {
        throw new Error(`Index "companion" not found. Available indexes: ${indexes}`);
      }

      console.log("✅ Pinecone is successfully connected and the index is working!");
    } catch (error) {
      console.error("❌ Pinecone initialization failed:", error);
    }
  }

  // public async vectorSearch(recentChatHistory: string, companionFileName: string) {
  //   try {
  //     const index = this.vectorDBClient.index("companion");

  //     const vectorStore = await PineconeStore.fromExistingIndex(
  //       new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  //       { pineconeIndex: index }
  //     );

  //     const similarDocs = await vectorStore.similaritySearch(recentChatHistory, 3, {
  //       fileName: companionFileName,
  //     });

  //     return similarDocs;
  //   } catch (err) {
  //     console.error("❌ Failed to execute vector search:", err);
  //     return [];
  //   }
  // }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.error("Companion Key Set Incorrectly!");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text
    });

    return result;
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.error("Companion Key Set Incorrectly!");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: string,
    delimiter: string = "\n",
    companionKey: CompanionKey
  ) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("User Already Has Chat History.");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
