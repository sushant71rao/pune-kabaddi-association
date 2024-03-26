import Axios from "@/Axios/Axios";
import IdCard from "@/components/IdCard";
import { User } from "@/schemas/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const IDPage = () => {
  const { id } = useParams();
  let player = useQuery<User>({
    queryKey: ["player"],
    queryFn: async () => {
      const res = await Axios.get(`/api/v1/players/get-player/${id}`);
      return res?.data?.data as User;
    },
  });

  return <div>{player?.data && <IdCard user={player?.data}></IdCard>}</div>;
};

export default IDPage;
