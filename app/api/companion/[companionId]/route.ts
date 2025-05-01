import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,

    {params} : {params: {companionId: string}}
){
     try{
          const body = await req.json();
          const user = await currentUser();
          const{name,
               description,
               instructions,
               seed,
               src,
               categoryId} = body ;

            if(!params.companionId){
                return new NextResponse("Companion ID is required", {status: 400})
            }

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
          
          const companion = await prismadb.companion.update({

            where:{
                id: params.companionId,
                userId: user.id
            },

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

          const completion = "Here is a sample response"; // Replace with actual AI logic
          console.log("Generated Completion:", completion); // ✅ Ensure response exists

          return NextResponse.json(companion);
     
   } catch (error) {
        console.error("[COMPANION_POST error]", error);
        return new NextResponse("Internal error", {status:500})    
   }
}

export async function DELETE
     (req: Request,

          {params} : {params: {companionId: string}}
      ){
          try {
               const user = await currentUser();
               const userId = user?.id;
               if(!userId){
                    return new NextResponse("Unauthorized, Get the hell out of my app",{status: 401})
               }
                const companion = await prismadb.companion.delete({
                    where: {
                         userId,
                         id: params.companionId
                    }
                })

               return NextResponse.json(companion)
          } catch (error) {
               console.error("[COMPANION_DELETE]", error);
               return new NextResponse("Internal error routeJs", {status:500})    
          }
      }
