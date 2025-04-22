"use client"

import { useProModal } from "@/hooks/use-po-modal"
import { Dialog, DialogContent,DialogHeader,DialogTitle,DialogDescription } from "./ui/dialog"
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { toast } from 'sonner';
import { useState } from "react";
import axios from "axios";


const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;
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
        finally {
            setLoading(false);
        }
    }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
            <DialogHeader className="space-y-4">
                <DialogTitle className="text-center">
                    Upgrade to pro
                </DialogTitle>
                <DialogDescription className="text-center space-y-2">
                    Create <span className="text-sky-500 font-medium mx-1">
                        Custom AI </span> Soul!

                </DialogDescription>
            </DialogHeader>
            <Separator/>
                <div className="flex justify-between">
                    <p className="text-2xl font-medium">
                        $1 
                        <span className="text-sm font-normal">
                            .99 /  mo
                        </span>

                    </p>
                    <Button disabled={loading} onClick={onSubscribe} variant="premium">
                Subscribe 
                    </Button>

                </div>
            
        </DialogContent>
    </Dialog>
  )
}

export default ProModal
