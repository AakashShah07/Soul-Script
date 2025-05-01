import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation"
import ChatClient from "./components/client"
import { auth } from "@clerk/nextjs/server"

interface ChatIdProps{
    params:{
        chatId: string
    }
}

const ChatIdPage = async ({
    params
}: ChatIdProps) => {

    const {userId} = auth()

    
    const {chatId} =  params;

    const companion = await prismadb.companion.findUnique({
        where:{
            id: chatId
        },
        include:{
            messages:{
                orderBy:{
                    createdAt: "asc"
                },
                where:{
                    userId
                }
            },
            _count:{
                select:{
                    messages: true
                }
            }
        }
    });

    if(!companion){
        return redirect("/");
    }

  return (
    <div>
      <ChatClient companion={companion}/>
    </div>
  )
}

export default ChatIdPage
