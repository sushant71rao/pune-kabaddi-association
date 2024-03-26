import React, { createContext, useState } from "react";
import { User, Team } from "../src/schemas/types";
import Axios from "@/Axios/Axios";

// type data = {
//   role?: string;
//   user?: User;
//   team?: Team;
// };

type iContext = {
  role?: string;
  user?: User;
  team?: Team;
  getuser?: (user: User, role: string) => void;
  getteam?: (team: Team, role: string) => void;
  logoutUser?: () => void;
};

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as iContext);
export const useAuthContext = () => React.useContext(AuthContext);

const AuthContextProvider = ({ children }: Props) => {
  let localuser: User | undefined;
  let localteam: Team | undefined;
  let localrole: string | undefined;
  if (localStorage.getItem("team")) {
    localteam = JSON.parse(localStorage.getItem("team") || "");
  }
  if (localStorage.getItem("user")) {
    localuser = JSON.parse(localStorage.getItem("user") || "");
  }
  if (localStorage.getItem("role")) {
    localrole = JSON.parse(localStorage.getItem("role") || "");
  }

  const [user, setUser] = useState<{
    role?: string;
    user?: User;
    team?: Team;
  }>({
    user: localuser,
    team: localteam,
    role: localrole || "",
  });

  let getuser = (user: User, role: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", JSON.stringify(role));
    setUser({ role: role, user: user });
  };
  let getteam = (team: Team, role: string) => {
    localStorage.setItem("team", JSON.stringify(team));
    localStorage.setItem("role", JSON.stringify(role));
    setUser({ role: role, team: team });
  };
  let logoutUser = async () => {
    try {
      let res = await await Axios.post("/api/v1/players/logout-player");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUser({});
      console.log(res);
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <AuthContext.Provider value={{ ...user, getteam, getuser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
