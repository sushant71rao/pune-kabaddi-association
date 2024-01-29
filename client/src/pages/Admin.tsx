import Sidebar, { SidebarItem } from "@/components/admin/Sidebar."
import { BarChart3, Boxes, LayoutDashboard, LifeBuoy, Package, Receipt, Settings, UserCircle } from "lucide-react"

const Admin = () => {
    return (
        <div className="mt-24 max-w-60">

            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Players" alert />
                <SidebarItem icon={<BarChart3 size={20} />} text="Teams" active />
                <SidebarItem icon={<UserCircle size={20} />} text="Officials" />
                <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
                <SidebarItem icon={<Package size={20} />} text="Orders" alert />
                <SidebarItem icon={<Receipt size={20} />} text="Billings" />
                <hr className="my-3" />
                <SidebarItem icon={<Settings size={20} />} text="Settings" />
                <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
            </Sidebar>

        </div>
    )
}

export default Admin