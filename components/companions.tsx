import { Companion } from "@prisma/client"
import Image from "next/image";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link";
  

interface ComProps{
    data:(Companion &{
        _count:{
            messages: number;
        }
    })[]
}

const Companions = ({
    data
}:ComProps) => {

    if(data.length === 0){
        return (    
            <div className="pt-10 flex flex-col items-center justify-normal space-y-3">
                <div className="relative w-60 h-60">
                    <Image
                    fill
                    className="grayscale"
                    alt="Empty"
                    src="/empty.png"
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    No souls found

                </p>
            </div>
        )
    }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-col-4 lg:grid-cols-1 xl:grid-cols-6 gap-2 pd-10">
        {data.map((item) => (
                    <Card
                    key={item.id}
                    className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
                    >
{/* <Link>
</Link> */}
                    </Card>
        ))
        }
      
    </div>
  )
}

export default Companions
