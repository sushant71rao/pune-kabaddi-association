import {
    Sheet,
    SheetContent,
    
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Separator } from "../ui/separator"
  import NavItems from "./NavItems"
import { Menu } from "lucide-react"
  
  
  const MobileNav = () => {
    return (
      <nav className="md:hidden block">
        <Sheet>
          <SheetTrigger className="align-middle h-full">
            <Menu  className="my-auto mx-4 "/>
            
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
            <img 
              src="/assets/logo.png"
              alt="logo"
             
            />
            <Separator className="border border-gray-50" />
            <NavItems />
          </SheetContent>
        </Sheet>
      </nav>
    )
  }
  
  export default MobileNav