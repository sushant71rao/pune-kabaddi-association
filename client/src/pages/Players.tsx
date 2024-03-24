import Axios from "@/Axios/Axios";
import { columns } from "@/components/admin/Players/columns";
import PeopleDataTable from "@/components/admin/Players/data-table";

import { useQuery } from "@tanstack/react-query";

const Players = () => {
  const fetchPlayerQuery = useQuery({
    queryKey: ["Players"],
    queryFn: async () => {
      const response = await Axios.get("api/v1/players/get-players");
      return response?.data;
    },
  });

  const data = fetchPlayerQuery.isSuccess ? fetchPlayerQuery.data.data : [{}];

  return (
    <div className="container py-10 mx-auto">
      <PeopleDataTable columns={columns} data={data} />
    </div>
  );
};

export default Players;
