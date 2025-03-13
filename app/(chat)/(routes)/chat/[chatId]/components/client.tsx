"use client";

import ChatHeader from "@/components/chat-header";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chatMessages";
import { ChatMessageProps } from "@/components/chat-message";
interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`, // Your backend API endpoint
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessgae: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessgae]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen p-4 space-y-2">
      <ChatHeader companion={companion} />
      <div className="flex-1 overflow-y-auto pr-4">
         <ChatMessages
          companion={companion}
         isLoading={isLoading}
        messages={messages}
         />
      </div>
      <ChatForm
        handleInputChange={handleInputChange}
        input={input}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
  
  
};

export default ChatClient;
