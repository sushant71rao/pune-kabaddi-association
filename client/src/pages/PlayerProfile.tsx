"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod";
import { teamRegistrationSchema } from "@/schemas/teamRegistrationSchema";

import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const formSchema = playerProfileSchema;

import { useToast } from "@/components/ui/use-toast";
import { playerProfileSchema } from "@/schemas/playerProfileSchema";
import DocumentView from "@/components/DocumentView";
import DocumentDownload from "./DocumentDownload";

const PlayerProfile = () => {

  const fetchTeamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/v1/teams/get-teams");
        return response.data;
      } catch (error) {
        console.log("error while fetching teams");
      }
    },
  });

  const fetchPlayerQuery = useQuery({
    queryKey: ["player"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "/api/v1/players/get-player/65b931a327383f419c6cdff3"
        );
        return response.data;
      } catch (error) {
        console.log("error while fetching teams");
      }
    },
  });


  const playerData = fetchPlayerQuery.isSuccess
    ? fetchPlayerQuery.data.data
    : [{}];

  const [date, setDate] = useState<Date | undefined>(
    playerData.birthDate ? new Date(playerData.birthDate) : undefined
  );



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      birthDate: date,
      avatar: "",
      adharNumber: "",
      adharCard: "",
      birthCertificate: "",
      password: "",
      achievements: [
        { achievementYear: "", achievementTitle: "", achievementDocument: "" },
      ],
    },
  });

  useEffect(() => {
    if (fetchPlayerQuery.isSuccess) {
      setDate(new Date(playerData.birthDate));
      
      form.reset(playerData);
    }
  }, [fetchPlayerQuery.isSuccess, playerData, form]);

  form.watch();

  const registerPlayer = async (playerData: z.infer<typeof formSchema>) => {

    {
      const formData = new FormData();

      for (const key in playerData) {
        if (key === "adharCard") {
          const adharCardFile = (playerData[key] as FileList)[0];
          formData.append(key, adharCardFile);
        } else if (key == "avatar") {
          const avatarFile = (playerData[key] as FileList)[0];
          formData.append(key, avatarFile);
        } else if (key == "birthCertificate") {
          const birthCertificateFile = (playerData[key] as FileList)[0];
          formData.append(key, birthCertificateFile);
        }
        // else if(key =='achievementDocument'){
        //   const achievementDocumentFile = (playerData[key] as FileList)[0];
        //   formData.append(key, achievementDocumentFile)
        // }
        else {
          // Use keyof to ensure that key is a valid property of playerData
          const validKey = key as keyof typeof playerData;
          const value = playerData[validKey];

          if (validKey === "birthDate" && value instanceof Date) {
            formData.append(validKey, value.toISOString());
          } else if (typeof value === "string" || typeof value === "number") {
            formData.append(validKey, value.toString());
          } else {
            console.warn(`Unsupported type for field '${validKey}'`);
          }
        }
      }

      try {
        const response = await axios.post(
          "/api/v1/players/register-player",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          throw new Error("Player Email already exists");
        } else {
          throw new Error("Player registration failed. Please try again.");
        }
      }
    }
  };

  const { toast } = useToast();

  const registerPlayerMutation = useMutation({
    mutationKey: ["registerPlayer"],
    mutationFn: registerPlayer,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Registration Failed !!",
        description: `${error}`,
      });
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Player Registered Successfully",
      });
    },
  });

  const avatarFileRef = form.register("avatar", { required: true });
  const adharCardFileRef = form.register("adharCard", { required: true });
  const birthCertificateFileRef = form.register("birthCertificate");


  const onSubmit = (playerData: z.infer<typeof formSchema>) => {
    console.log(playerData);
    registerPlayerMutation.mutate(playerData);
  };


  return (
    <Card className="max-w-2xl sm:mx-auto mx-4 p-4 my-32">
      <CardHeader>
        <CardTitle className="text-3xl font-black text-slate-700">
          Player Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Full Name */}
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="md:w-fit w-full">
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem className="md:w-fit w-full">
                    <FormLabel>Middle Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Father's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="md:w-fit w-full">
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Sur name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birth Date */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className=" w-auto p-0">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          field.onChange(date);
                        }}
                        fromYear={1960}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Please check the date once again.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select your Gender*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={playerData.gender}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="m">Male</SelectItem>
                        <SelectItem value="f">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Your Team*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={playerData.team}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="choose team" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {fetchTeamsQuery.isPending ? (
                        <p>loading...</p>
                      ) : fetchTeamsQuery.error ? (
                        <p>error while loading data </p>
                      ) : (
                        fetchTeamsQuery.data.data.map(
                          (item: z.infer<typeof teamRegistrationSchema>) => {
                            return (
                              <SelectItem
                                value={item.teamName}
                                key={item.email}
                              >
                                {item.teamName}
                              </SelectItem>
                            );
                          }
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Playing Skill */}
            <FormField
              control={form.control}
              name="playingSkill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playing Skill*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={playerData.playingSkill}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="raider">Raider</SelectItem>
                        <SelectItem value="defender">Defender</SelectItem>
                        <SelectItem value="allRounder">All Rounder</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* Adhar Number */}
            <FormField
              control={form.control}
              name="adharNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Enter Adhar Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Adhar number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Avatar */}
            <div className="flex w-full items-end gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <FormLabel>Profile Photo*</FormLabel>
                    <FormControl>
                      <Input id="avatar" type="file" {...avatarFileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                      <DocumentView imgUrl={playerData.avatar} />
              <DocumentDownload imgUrl={playerData.avatar} />
            </div>

            {/* Adhar Card */}
            <div className="flex gap-4 flex-wrap items-end">
              <FormField
                control={form.control}
                name="adharCard"
                render={() => (
                  <FormItem className="w-fit">
                    <FormLabel>Adhar Card</FormLabel>
                    <FormControl>
                      <Input id="picture" type="file" {...adharCardFileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DocumentView imgUrl={playerData.adharCard} />
              <DocumentDownload imgUrl={playerData.adharCard} />
            </div>

            {/* Birth Certificate */}
            <div className="flex gap-4 flex-wrap items-end">
              <FormField
                control={form.control}
                name="birthCertificate"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Birth Certificate OR Bonafide Certificate*
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="picture"
                        type="file"
                        {...birthCertificateFileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<DocumentView imgUrl={playerData.birthCertificate} />
              <DocumentDownload imgUrl={playerData.birthCertificate} />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={registerPlayerMutation.isPending}
            >
              {registerPlayerMutation.isPending ? (
                <>
                  Submitting{" "}
                  <img
                    src="/assets/loading.svg"
                    alt="loading"
                    className="w-6 h-6 ml-4"
                  />{" "}
                </>
              ) : (
                "Submit"
              )}
            </Button>
            <p className="text-red-600 font-semibold">
              {registerPlayerMutation.error &&
                registerPlayerMutation.error?.message}{" "}
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;
