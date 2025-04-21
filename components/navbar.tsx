"use client"

import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import MobileSideBar from "@/components/mobileSidebar"

import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme_toggle";
import { useProModal } from "@/hooks/use-po-modal";
const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const Navbar = () => {

  const proModal = useProModal();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className="flex items-center">
        <MobileSideBar/>
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            Soul Script
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <Button variant="premium" onClick={proModal.onOpen}>
          Upgrade
          <Sparkles className="h-4 w-4 fill-white text-white" />
        </Button>
            <ModeToggle/>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
