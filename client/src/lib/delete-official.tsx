import Axios from "@/Axios/Axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the mutation function with TypeScript types
const deleteOfficial = async (id: string): Promise<void> => {
  await Axios.delete(`/api/v1/officials/delete-official/${id}`);
};

// Define the component prop types
interface DeleteOfficialProps {
  id: string;
}

const DeleteOfficial: React.FC<DeleteOfficialProps> = ({ id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
      toast({
        title: "Official Deleted Successfully ",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete Official ",
      });
      console.error("Error deleting Official:", error);
    },
  });

  const handleDeleteOfficial = () => {
    mutate(id);
  };

  return (
    <Button variant="destructive" onClick={handleDeleteOfficial}>
      Delete Official
    </Button>
  );
};

export default DeleteOfficial;
