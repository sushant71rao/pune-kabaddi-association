import Axios from "@/Axios/Axios";
import { columns } from "@/components/admin/players/columns";
import PeopleDataTable from "@/components/admin/players/data-table";

import { useQuery } from "@tanstack/react-query";

const Players = () => {
  const fetchPlayerQuery = useQuery({
    queryKey: ["players"],
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
