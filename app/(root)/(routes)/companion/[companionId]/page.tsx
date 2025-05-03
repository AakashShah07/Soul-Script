import prismadb from "@/lib/prismadb";
import Companion_form from "./components/companion-form";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { RedirectToSignIn } from "@clerk/nextjs";



const CampanionIdPage = async({
    params
}) => {

     const user = await currentUser();
     const userId = user?.id;

     if(!userId){
        return RedirectToSignIn;
     }


    const { companionId } = await params; // Await params here

    const companion = await prismadb.companion.findUnique({
        where: {
            id: companionId,
            userId
        }
    });

    const categories = await prismadb.category.findMany();


  return (
    <Companion_form 
        initialData={companion}
        categories={categories}
    />
     
  )
}

export default CampanionIdPage
