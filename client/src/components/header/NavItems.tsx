import { headerLinks, AdminLinks } from "@/constants";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

const NavItems = () => {
  //   const navigate = useNavigate();
  let { user } = useContext(AuthContext);
  // console.log(role);
  let Links: { route: string; label: string }[] = headerLinks;
  if (user?.isAdmin) {
    Links = headerLinks.concat(AdminLinks);
  }
  return (
    <ul className="md:flex-between md:items-center md:justify-center flex w-full flex-col items-start gap-5 md:flex-row">
      {Links.map((link) => {
        return (
          <li key={Math.random()}>
            <NavLink
              to={link.route}
              className={({ isActive }) =>
                `font-bold text-md block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-red-600" : "text-slate-800"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0`
              }
            >
              {link.label}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
