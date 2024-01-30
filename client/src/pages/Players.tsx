import { columns } from "@/components/admin/Players/columns";
import PeopleDataTable from "@/components/admin/Players/data-table";
import { people } from "@/constants/people";



const Players = () => {
    return (
        <div className="container py-10 mx-auto mt-20">
            <PeopleDataTable columns={columns} data={people} />
        </div>
    );
};

export default Players;