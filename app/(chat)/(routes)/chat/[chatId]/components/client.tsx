"use client";

import ChatHeader from "@/components/chat-header";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!input.trim()) return;

  //   console.log("Submitting message:", input);

  //   const userMessage: ChatMessageProps = {
  //     role: "user",
  //     content: input
  //   };

  //   setMessages((current) => [...current, userMessage]);
  //   setInput("");
  //   setIsLoading(true);

  //   try {
  //     // 🚀 HARDCODED RESPONSE (instead of API)
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

  //     const systemMessage: ChatMessageProps = {
  //       role: "system",
  //       content: "This is a hardcoded response! 🚀" // Hardcoded AI response
  //     };

  //     setMessages((current) => [...current, systemMessage]);

  //     console.log("🟢 Hardcoded response sent:", systemMessage.content);
  //   } catch (error) {
  //     console.error("🔴 Error handling message:", error);
  //   } finally {
  //     setIsLoading(false);
  //     router.refresh();
  //   }
  // };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    console.log("Submitting message:", input);

    const userMessage: ChatMessageProps = {
        role: "user",
        content: input
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const response = await fetch(`/api/chat/${companion.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: input }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Read streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = "";

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
                setMessages((current) => [...current, { role: "system", content: result }]);
            }
        }

        console.log("🟢 AI Response:", result);
    } catch (error) {
        console.error("🔴 Error fetching AI response:", error);
    } finally {
        setIsLoading(false);
        router.refresh();
    }
};

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <div className="flex-1 overflow-y-auto pr-4">
        <ChatMessages companion={companion} isLoading={isLoading} messages={messages} />
      </div>
      <ChatForm
  handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
  input={input}
  onSubmit={onSubmit}
  isLoading={isLoading}
/>

    </div>
  );
};

export default ChatClient;
