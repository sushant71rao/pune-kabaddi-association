import { ReactNode } from "react"


type sidebarProps = {
  children: ReactNode
}

export default function Sidebar({ children }: sidebarProps) {

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">


        <ul className="flex-1 px-3">{children}</ul>
      </nav>
    </aside>
  )
}

type sideBarItemsProps = {
  icon: ReactNode,
  text: string,
  active?: boolean,
  alert?: boolean,
}

export function SidebarItem({ icon, text, active }: sideBarItemsProps) {

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-2
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-primary text-white"
          : "hover:bg-gray-200 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className="overflow-hidden transition-all w-52 ml-3"

      >
        {text}
      </span>




    </li>
  )
}