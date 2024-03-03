import React, { createContext, useState } from "react";
import { User, Team } from "../src/schemas/types";


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
};

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as iContext);
export const useAuthContext = () => React.useContext(AuthContext);

const AuthContextProvider = ({ children }: Props) => {
  let localuser: User = {} as User;
  let localteam: Team = {} as Team;
  let localrole: string = "";
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
  return (
    <AuthContext.Provider value={{ ...user, getteam, getuser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
