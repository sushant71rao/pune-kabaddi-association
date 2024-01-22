
import { headerLinks } from "@/constants";
import { NavLink } from "react-router-dom";

const NavItems = () => {
  //   const navigate = useNavigate();
  return (
    <ul className="md:flex-between md:items-center md:justify-center flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        return (
          <li key={link.label}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-gray-800" : "text-gray-900"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-gray-900 lg:p-0`
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
