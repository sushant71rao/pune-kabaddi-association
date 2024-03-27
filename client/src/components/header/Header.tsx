import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

import { AuthContext } from "../../../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, User } from "lucide-react";

const Header = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos <= 100 || prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, visible]);

  let { user, logoutUser } = useContext(AuthContext);
  // console.log(user);
  // const queryClient = useQueryClient();

  const handleLogout = () => {
    console.log("hii");
    logoutUser();
  };

  return (
    <>
      {/* <Image></Image> */}
      <header
        className={`z-10 w-full bg-white border-b p-4 sticky  top-0 transition-transform ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="wrapper flex items-center justify-between">
          <div className="w-36">
            <Link to={"/"}>
              <img src="/assets/logo.png" width={80} height={38} alt="logo" />
            </Link>
          </div>
          <nav className="lg:flex lg:flex-between hidden w-full max-w-xl">
            <NavItems />
          </nav>
          <div className="flex w-32 justify-end gap-3">
            {!user ? (
              <Button asChild className="rounded-full" size="lg">
                <Link to="/register">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Avatar>
                      <AvatarImage src={String(user?.avatar)} alt="profile" />
                      <AvatarFallback>{user?.firstName}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <Link to={"/profile"}>
                    <DropdownMenuItem className="cursor-pointer">
                      Profile{" "}
                      <DropdownMenuShortcut>
                        <User />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out{" "}
                    <DropdownMenuShortcut>
                      <LogOutIcon />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <MobileNav />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
