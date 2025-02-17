import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog"; // Import DialogTitle from Radix UI
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden for screen readers
import SideBar from "./sidebar";

const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        {/* VisuallyHidden ensures screen readers can detect the title */}
        <DialogTitle asChild>
          <VisuallyHidden>Mobile Sidebar</VisuallyHidden>
        </DialogTitle>
        <SideBar/>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideBar;
