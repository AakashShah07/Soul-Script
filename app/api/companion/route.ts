import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request){
     try{
          const body = await req.json();
          const user = await currentUser();
          const{name,
               description,
               instructions,
               seed,
               src,
               categoryId} = body ;

          if(!user || !user.id || !user.firstName ){
               return new NextResponse("Unauthorized", {status: 401})
          }

          if(!src || !name || !description || !seed || !categoryId){
               return new NextResponse("Missing required fields", {status:400})
          }

          const isPro = await checkSubscription();

          if(!isPro){
               return new NextResponse("Pro subsciption required", {status: 403});
          }
          
          const companion = await prismadb.companion.create({
               data:{
                    categoryId,
                    userId: user.id,
                    userName: user.firstName,
                    src,
                    name,
                    description,
                    instructions,
                    seed
               }
          });

          return NextResponse.json(companion);
     
   } catch (error) {
        console.error("[COMPANION_POST error]", error);
        return new NextResponse("Internal error", {status:500})    
   }
}

