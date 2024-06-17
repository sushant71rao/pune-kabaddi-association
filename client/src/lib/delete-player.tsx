import Axios from "@/Axios/Axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the mutation function with TypeScript types
const deletePlayer = async (id: string): Promise<void> => {
  const response = await Axios.delete(`/api/v1/players/delete-player/${id}`);

  console.log(response);
};

// Define the component prop types
interface DeleteRecordProps {
  id: string;
}

const DeleteRecord: React.FC<DeleteRecordProps> = ({ id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Players"] });
      toast({
        title: "Player Deleted Successfully ",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete player ",
      });
      console.error("Error deleting player:", error);
    },
  });

  const handleDeletePlayer = () => {
    mutate(id);
  };

  return (
    <Button variant="destructive" onClick={handleDeletePlayer}>
      Delete Player
    </Button>
  );
};

export default DeleteRecord;
