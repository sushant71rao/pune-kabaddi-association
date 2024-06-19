import Axios from "@/Axios/Axios";
import { columns } from "@/components/admin/teams/columns";
import TeamDataTable from "@/components/admin/teams/data-table";

import { useQuery } from "@tanstack/react-query";

const Players = () => {
  const fetchTeamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await Axios.get("api/v1/teams/get-teams");
      return response?.data;
    },
  });

  const data = fetchTeamsQuery.isSuccess ? fetchTeamsQuery.data.data : [{}];

  return (
    <div className="container py-10 mx-auto">
      <TeamDataTable columns={columns} data={data} />
    </div>
  );
};

export default Players;
