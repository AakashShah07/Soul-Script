import { streamText } from "ai";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  context: { params: { chatId: string } }
) {
  try {
    const { chatId } = await context.params;

    // const chatId = context.params.chatId;
    if (!chatId) return new NextResponse("Chat ID is missing", { status: 400 });

    const { prompt } = await request.json();
    const user = await currentUser();
    if (!user || !user.firstName || !user.id)
      return new NextResponse("Unauthorized!", { status: 401 });

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);
    if (!success)
      return new NextResponse("Ratelimit Exceeded!", { status: 429 });

    const companion = await prismadb.companion.update({
      where: { id: chatId },
      data: {
        messages: {
          create: { content: prompt, role: "user", userId: user.id },
        },
      },
    });

    if (!companion)
      return new NextResponse("Companion not found", { status: 404 });

    const name = companion.id;
    const companion_file_name = name + ".txt";

    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama-2-13b-chat",
    };
    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readLatestHistory(companionKey);

    if (records.length === 0)
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

    const recentChatHistory = await memoryManager.readLatestHistory(
      companionKey
    );
    // const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name);fhgfhjyi

    // const relevantHistory = similarDocs?.map((doc) => doc.pageContent).join("\n") || "";

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const input = {
      max_length: 2048,
      prompt: `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.

        ${companion.instructions}

        // Below are relevant details about ${companion.name}'s past and the conversation you are in.
        // relevantHistory}

        ${recentChatHistory}\n${companion.name}:`,
    };

    let responseText = "";

    for await (const event of replicate.stream("meta/meta-llama-3-8b-instruct", { input })) {
      responseText += event;
    }

        if (responseText) {
          await memoryManager.writeToHistory(responseText.trim(), companionKey);
          await prismadb.companion.update({
            where: { id: chatId },
            data: { messages: { create: { content: responseText.trim(), role: "system", userId: user.id } } },
          });
        }
        console.log("Response Text is coming ",responseText);

        // return new NextResponse(responseText, { status: 200 });
        const jsonResponse = { message: responseText.trim() };
    console.log("Response JSON:", jsonResponse);

    // Send JSON response (assuming this is an Express.js API)
    // return NextResponse.json({ message: responseText.trim() });
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(responseText.trim()));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

    // await memoryManager.writeToHistory(responseText, companionKey);
    // await prismadb.companion.update({
    //   where: { id: chatId },
    //   data: {
    //     messages: {
    //       create: { content: responseText, role: "system", userId: user.id },
    //     },
    //   },
    // });

    // console.log("Response Text:", responseText);

    // return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
