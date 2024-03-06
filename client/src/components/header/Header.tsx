import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
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

  const { data: currentPlayer, isError } = useQuery({
    queryKey: ["currentPlayer"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/players/current-player");
      return response.data;
    },
  });

  const queryClient = useQueryClient();
  // const { mutate: logout } = useLogout();

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await axios.post("/api/v1/players/logout-player");
      return response.data;
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <header
        className={`z-10 w-full bg-white border-b p-4 fixed top-0 transition-transform ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="wrapper flex items-center justify-between">
          <div className="w-36">
            <img src="/assets/logo.png" width={80} height={38} alt="logo" />
          </div>

          <nav className="md:flex md:flex-between hidden w-full max-w-xl">
            <NavItems />
          </nav>

          <div className="flex w-32 justify-end gap-3">
            {isError ? (
              <Button asChild className="rounded-full" size="lg">
                <Link to="/register">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Avatar>
                      <AvatarImage src={currentPlayer?.avatar} alt="profile" />
                      <AvatarFallback>
                        {currentPlayer?.firstName}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                    Profile{" "}
                    <DropdownMenuShortcut>
                      <User />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
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
