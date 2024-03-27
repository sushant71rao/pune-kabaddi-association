import React, { createContext, useState } from "react";
import { User, Team } from "../src/schemas/types";
import Axios from "@/Axios/Axios";

// type data = {
//   role?: string;
//   user?: User;
//   team?: Team;
// };

type iContext = {
  user?: User;
  team?: Team;
  getuser?: (user: User) => void;
  getteam?: (team: Team) => void;
  logoutUser: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as iContext);
export const useAuthContext = () => React.useContext(AuthContext);

const AuthContextProvider = ({ children }: Props) => {
  let localuser: User | undefined;
  let localteam: Team | undefined;

  if (localStorage.getItem("team")) {
    localteam = JSON.parse(localStorage.getItem("team") || "");
  }
  if (localStorage.getItem("user")) {
    localuser = JSON.parse(localStorage.getItem("user") || "");
  }

  const [user, setUser] = useState<{
    user?: User;
    team?: Team;
  }>({
    user: localuser,
    team: localteam,
  });

  let getuser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));

    setUser({ user: user });
  };
  let getteam = (team: Team) => {
    localStorage.setItem("team", JSON.stringify(team));

    setUser({ team: team });
  };
  let logoutUser = async () => {
    try {
      // console.log("Heree");

      let res = await Axios.post("/api/v1/players/logout");
      console.log(res);
      // console.log("Heree");
      localStorage.removeItem("user");
      setUser({});
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
