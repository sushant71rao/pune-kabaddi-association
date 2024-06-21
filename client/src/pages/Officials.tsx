import Axios from "@/Axios/Axios";
import { columns } from "@/components/admin/officials/columns";
import PeopleDataTable from "@/components/admin/officials/data-table";

import { useQuery } from "@tanstack/react-query";

const Officials = () => {
  const fetchPlayerQuery = useQuery({
    queryKey: ["Officials"],
    queryFn: async () => {
      const response = await Axios.get("api/v1/officials/get-officials");
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

export default Officials;
