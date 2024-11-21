import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Axios from "@/Axios/Axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { useToast } from "./ui/use-toast";

const RegisterTeamButton = ({ id }: { id: string }) => {
  const [teamSelect, setTeam] = useState({ _id: "", name: "" }); // State for selected team name
  const [isDialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [openPopover, setOpenPopover] = useState(false); // State for popover visibility
  const { toast } = useToast();

  // Fetch teams using React Query
  const {
    data: teams,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await Axios.get("/api/v1/teams/get-teams");
      return response?.data?.data;
    },
    retry: 3, // Retry logic in case of API failure
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await Axios.post(`/api/v1/competitions/${id}`, {
          teamId: teamSelect?._id,
        });
        console.log(res?.data);
        toast({
          variant: "default",
          title: "Success",
          description: res?.data?.message || "Team Registered Successfully",
        });
      } catch (error) {
        console.log(error);
      }
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to Register Team",
      });
    },
  });

  const handleSelectTeam = ({ id, name }: { id: string; name: string }) => {
    setTeam({ _id: id, name: name }); // Update the selected team
    setOpenPopover(false); // Close the popover
  };

  const handleSubmit = () => {
    if (!teamSelect?.name.trim()) {
      alert("Please select a valid team!");
    } else {
      mutate();
      setDialogOpen(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      {/* Button to open the Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition duration-200">
            Register Your Team
          </Button>
        </DialogTrigger>

        {/* Dialog content for team registration */}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Your Team</DialogTitle>
            <DialogDescription>
              Select your team's name from the list below to register for the
              competition.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col">
            {/* Popover for selecting teams */}
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPopover}
                  className="justify-between min-w-[300px] w-full"
                >
                  {teamSelect?.name || "Select Team"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search Teams" />
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <p>Loading teams...</p>
                    </div>
                  ) : isError ? (
                    <div className="flex justify-center p-4 text-red-500">
                      Error loading teams.
                    </div>
                  ) : (
                    <CommandList>
                      <CommandEmpty>No teams found.</CommandEmpty>
                      <CommandGroup>
                        {teams?.map(
                          (team: { _id: string; teamName: string }) => (
                            <CommandItem
                              key={team._id}
                              value={team.teamName}
                              onSelect={() =>
                                handleSelectTeam({
                                  id: team?._id,
                                  name: team?.teamName,
                                })
                              }
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  teamSelect?.name === team.teamName
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {team.teamName}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="mr-4"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterTeamButton;
