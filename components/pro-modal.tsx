"use client"

import { useProModal } from "@/hooks/use-po-modal"
import { Dialog, DialogContent,DialogHeader,DialogTitle,DialogDescription } from "./ui/dialog"


const ProModal = () => {
    const proModal = useProModal();
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Upgrade to pro
                </DialogTitle>
                <DialogDescription className="text-center space-y-2">
                    Create <span className="text-sky-500 font-medium mx-1">
                        Custom AI </span> Soul!

                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default ProModal
