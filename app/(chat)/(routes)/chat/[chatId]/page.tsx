import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async (props: PageProps) => {
  const params = await props.params;

  const { userId } = await auth();

  const { chatId } = params;

  const companion = await prismadb.companion.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!companion) {
    return redirect("/");
  }

  return (
    <div>
      <ChatClient companion={companion} />
    </div>
  );
};

export default ChatIdPage;
