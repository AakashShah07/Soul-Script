import prismadb from "@/lib/prismadb";
import Companion_form from "./components/companion-form";

interface CampanionIdPageProps {
    params: {
        companionId: string
    };
};


const CampanionIdPage = async({
    params
}: CampanionIdPageProps) => {


    const companion = await prismadb.companion.findUnique({
        where:{
            id: params.companionId
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
