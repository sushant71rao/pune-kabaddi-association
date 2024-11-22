import { useContext, useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
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
  }, [prevScrollPos]);

  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <>
      <header
        className={`z-10 w-full bg-white text-white shadow-md p-4 sticky top-0 transition-transform ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="wrapper flex items-center justify-between px-6">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={"/"}>
              <img
                src="/assets/logo.png"
                alt="logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="ml-2 text-xl font-semibold text-red-500">
              MyApp
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <NavItems />
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Add Competition Button */}
            <Button
              asChild
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all px-4 py-2 text-sm"
            >
              {user?.isAdmin && (
                <Link to="admin/competition-registration">Add Competition</Link>
              )}
            </Button>

            {/* Login Button or Profile Dropdown */}
            {!user ? (
              <Button
                asChild
                className="rounded-full bg-red-500 text-white hover:bg-red-600 transition-all px-6 py-2 text-sm"
              >
                <Link to="/register">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Avatar className="cursor-pointer border border-red-500">
                      <AvatarImage src={String(user?.avatar)} alt="profile" />
                      <AvatarFallback className="bg-gray-700 text-red-500">
                        {user?.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 text-white">
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
            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
