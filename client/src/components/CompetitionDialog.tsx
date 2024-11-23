import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TeamCompetitionForm } from "@/schemas/TeamCompetitionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const RegisterTeamButton = ({ id }: { id: string }) => {
  const [teamSelect, setTeam] = useState({ _id: "", name: "" });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: "subJunior", label: "Sub Junior" },
    { id: "junior", label: "Junior" },
    { id: "open", label: "Open" },
  ];

  const zones = [
    {
      name: "पुणे शहर",
    },
    {
      name: "पिंपरी चिंचवड",
    },
    {
      name: "पुणे ग्रामीण",
    },
  ];

  const form = useForm<z.infer<typeof TeamCompetitionForm>>({
    resolver: zodResolver(TeamCompetitionForm),
    defaultValues: {
      team: { teamId: "", name: "" },
      zone: "",
      category: "",
      players: [],
    },
  });

  const {
    data: teams,
    isLoading: teamLoading,
    isError: teamError,
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

  const handleSubmit = (data: z.infer<typeof TeamCompetitionForm>) => {
    if (!teamSelect?.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid team!",
      });
    } else {
      mutate();
      setDialogOpen(false);
    }
  };

  const [Players, setPlayers] = useState<
    {
      _id: string;
      firstName: string;
      middleName: string;
      lastName: string;
      playingSkill: string;
    }[]
  >([]);

  const fetchPlayers = async (teamName: string) => {
    if (teamName) {
      console.log(teamName);
      try {
        const res = await Axios.post("/api/v1/players/get-players", {
          teamName: teamName,
        });
        console.log(res?.data);
        setPlayers(res.data?.data || []);
        console.log(res.data); // Handle the response here
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition duration-200">
            Register Your Team
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Your Team</DialogTitle>
            <DialogDescription>
              Select your team's name from the list below to register for the
              competition.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col"
            >
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Your Team*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between min-w-[300px] w-fit"
                        >
                          {field?.value.name != ""
                            ? field?.value?.name
                            : "Select Team"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput placeholder="Select team" />
                          {teamLoading ? (
                            <div className="flex justify-center p-4">
                              <p>Loading teams...</p>
                            </div>
                          ) : teamError ? (
                            <div className="flex justify-center p-4 text-red-500">
                              Error loading teams
                            </div>
                          ) : (
                            <CommandList>
                              <CommandEmpty>No team found.</CommandEmpty>
                              <CommandGroup>
                                {teams?.map((team: any) => (
                                  <CommandItem
                                    key={team._id}
                                    value={team?.teamName}
                                    onSelect={() => {
                                      field.onChange({
                                        teamId: team._id,
                                        name: team.teamName,
                                      });
                                      fetchPlayers(team?.teamName);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value.name === team.teamName
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                    {team.teamName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors?.team && (
                      <FormMessage>
                        {form.formState.errors.team.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex gap-2 w-full justify-between mt-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Select a Category*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          <SelectGroup>
                            {categories?.map((ele, i) => (
                              <SelectItem key={i} value={ele.id}>
                                {ele.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Select a Zone*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Zone" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          <SelectGroup>
                            {zones.map((zone, i) => (
                              <SelectItem key={i} value={zone.name}>
                                {zone.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <Button className="mt-3" type="submit">
                Submit
              </Button>
            </form>
          </Form>

          {/* <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="mr-4"
            >
              Cancel
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterTeamButton;
