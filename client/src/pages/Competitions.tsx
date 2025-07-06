import Axios from "@/Axios/Axios";
import { Competition } from "@/schemas/types";
import { competitionColumns } from "@/components/admin/competitions/columns";
import DataTable from "@/components/admin/competitions/data-table";

import { useQuery } from "@tanstack/react-query";

const fetchCompetitions = async (): Promise<Competition[]> => {
  const response = await Axios.get("/api/v1/competitions/get");
  return response.data;
};

const Competitions = () => {
  const { data: competitions, isSuccess } = useQuery({
    queryKey: ["competitions"],
    queryFn: fetchCompetitions,
  });

  console.log(competitions);

  const data = isSuccess ? competitions : [{} as Competition];

  return (
    <div className="container py-10 mx-auto">
      <DataTable columns={competitionColumns} data={data} />
    </div>
  );
};

export default Competitions;
