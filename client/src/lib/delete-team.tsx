import Axios from "@/Axios/Axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the mutation function with TypeScript types
const deleteTeam = async (id: string): Promise<void> => {
  const response = await Axios.delete(`/api/v1/teams/delete-team/${id}`);

  console.log(response);
};

// Define the component prop types
interface DeleteTeamProps {
  id: string;
}

const DeleteTeam: React.FC<DeleteTeamProps> = ({ id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast({
        title: "Team Deleted Successfully ",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete Team ",
      });
      console.error("Error deleting Team:", error);
    },
  });

  const handleDeleteTeam = () => {
    mutate(id);
  };

  return (
    <Button variant="destructive" onClick={handleDeleteTeam}>
      Delete Team
    </Button>
  );
};

export default DeleteTeam;
