"use client"

import { Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { toast } from 'sonner';
import { setGlobal } from "next/dist/trace";
import axios from "axios";


interface SubscriptionButtonProps{
    isPro: boolean
}

const SubscriptionButton = ({isPro=false}: SubscriptionButtonProps) => {

    const [loading, setLoading] = useState(false);

    const onClick = async () =>{
        try {
            setLoading(true);

            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url ;

        } catch (error) {
            toast.error("Something went wrong!", {
                duration: 3000, // Toast disappears after 3 seconds
                description: "Please try again later.",
                action: {
                  label: "Retry",
                  onClick: () => console.log("Retry clicked"),
                },
              });
            console.log("Error subscribing to pro plan", error);
        }
    }

  return (
    <Button onClick={onClick} disabled={loading} size="sm" variant={isPro?"default" : "premium"}>
        {isPro ? "Manage Subscription" : "Upgrade"}
        {!isPro && <Sparkles className="h-4 w-4 ml-2 fill-white" />}
      
    </Button>
  )
}

export default SubscriptionButton
