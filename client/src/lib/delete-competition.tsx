import Axios from "@/Axios/Axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the mutation function with TypeScript types
const deleteCompetition = async (id: string): Promise<void> => {
  const response = await Axios.delete(`/api/v1/competitions/${id}`);

  console.log(response);
};

// Define the component prop types
interface DeleteCompetitionProps {
  id: string;
}

const DeleteCompetition: React.FC<DeleteCompetitionProps> = ({ id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteCompetition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      toast({
        title: "Competition Deleted Successfully ",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete Competition ",
      });
      console.error("Error deleting Competition:", error);
    },
  });

  const handleDeleteCompetition = () => {
    mutate(id);
  };

  return (
    <Button variant="destructive" onClick={handleDeleteCompetition}>
      Delete Competition
    </Button>
  );
};

export default DeleteCompetition;
