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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod";
import { teamRegistrationSchema } from "@/schemas/teamRegistrationSchema";

import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const formSchema = playerProfileSchema;

import { useToast } from "@/components/ui/use-toast";
import { playerProfileSchema, PlayerType } from "@/schemas/playerProfileSchema";
import DocumentView from "@/components/DocumentView";
import DocumentDownload from "./DocumentDownload";
import Axios from "@/Axios/Axios";
import { useParams } from "react-router-dom";

const PlayerProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState<File>();
  const [birthCertificate, setBirthCertificate] = useState<File>();
  const [aadharCard, setAadharCard] = useState<File>();

  const { id } = useParams();
  const fetchTeamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      try {
        const response = await Axios.get("/api/v1/teams/get-teams");
        return response.data;
      } catch (error) {
        console.log("error while fetching teams");
      }
    },
  });

  const fetchPlayerQuery = useQuery<PlayerType | undefined>({
    queryKey: ["player"],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/api/v1/players/get-player/${id}`);
        // console.log(response.data.data);
        return response.data.data as PlayerType;
      } catch (error) {
        console.log("error while fetching teams", error);
      }
    },
  });

  let { data } = fetchPlayerQuery;

  const [date, setDate] = useState<Date | undefined>(
    data?.birthDate || undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      middleName: data?.middleName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phoneNo: data?.phoneNo || "",
      birthDate: data?.birthDate || date,
      adharNumber: data?.adharNumber || "",
      // avatar: data?.avatar || "",
      // adharCard: data?.adharCard || "",
      // birthCertificate: data?.birthCertificate || "",
      password: "",
      achievements: [
        { achievementYear: "", achievementTitle: "", achievementDocument: "" },
      ],
    },
  });

  useEffect(() => {
    if (fetchPlayerQuery.isSuccess) {
      setDate(new Date(data?.birthDate || ""));

      form.reset(data);
    }
  }, [fetchPlayerQuery.isSuccess, data, form]);

  form.watch();

  const registerPlayer = async (playerData: z.infer<typeof formSchema>) => {
    {
      console.log(playerData);
      let formData = form.getValues();
      try {
        const response = await Axios.patch(
          `/api/v1/players/update-player-details/${id}`,
          {
            ...formData,
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

  const FileUpdate = useMutation({
    mutationKey: ["fileupdate"],
    mutationFn: async (files: any) => {
      try {
        let response = await Axios.patch(
          `/api/v1/players/update-files/${id}`,
          files,
          {
            // withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
  });

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
        description: "Player Updated Successfully",
      });
    },
  });

  // const avatarFileRef = form.register("avatar", { required: true });
  // const adharCardFileRef = form.register("adharCard", { required: true });
  // const birthCertificateFileRef = form.register("birthCertificate");

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
                  <Input
                    type="date"
                    className="w-min"
                    onChange={(elem) => {
                      // console.log(elem?.target.value);
                      field?.onChange(new Date(elem?.target.value));
                    }}
                    value={
                      field?.value &&
                      new Date(field?.value)?.toISOString()?.substring(0, 10)
                    }
                  ></Input>
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

                  <Select onValueChange={field.onChange} value={data?.gender}>
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
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    value={data?.teamName}
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
                    defaultValue={field?.value}
                    onValueChange={field.onChange}
                    value={data?.playingSkill}
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
            {/* <div className="flex w-full items-end gap-4 flex-wrap">
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
              <DocumentView imgUrl={data?.avatar} />
              <DocumentDownload imgUrl={data?.avatar} />
            </div> */}

            {/* Adhar Card */}
            {/* <div className="flex gap-4 flex-wrap items-end">
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
              <DocumentView imgUrl={data?.adharCard} />
              <DocumentDownload imgUrl={data?.adharCard} />
            </div> */}

            {/* Birth Certificate */}
            {/* <div className="flex gap-4 flex-wrap items-end">
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

              <DocumentView imgUrl={data?.birthCertificate} />
              <DocumentDownload imgUrl={data?.birthCertificate} />
            </div> */}

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
        <div className="flex flex-col gap-3 ">
          <div className="flex justify-between items-end">
            <div className="flex gap-2 items-end">
              <div>
                <div className="text-sm font-medium">Profile Photo</div>
                <Input
                  type="file"
                  onChange={(e) => {
                    setProfilePhoto(e?.target?.files?.[0] || ({} as File));
                  }}
                ></Input>
              </div>
              <div className="flex gap-1">
                <DocumentView
                  imgUrl={
                    profilePhoto
                      ? URL.createObjectURL(profilePhoto)
                      : data?.avatar
                  }
                />
                <DocumentDownload
                  imgUrl={
                    profilePhoto
                      ? URL.createObjectURL(profilePhoto)
                      : data?.avatar
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => {
                // console.log(profilePhoto);
                const formData = new FormData();
                formData.append("avatar", profilePhoto!, profilePhoto?.name);
                FileUpdate.mutate(formData);
              }}
            >
              Submit
            </Button>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex gap-2 items-end">
              <div>
                <div className="text-sm font-medium">Birth Certificate</div>
                <Input
                  type="file"
                  onChange={(e) => {
                    setBirthCertificate(e?.target?.files?.[0] || ({} as File));
                  }}
                ></Input>
              </div>
              <div className="flex gap-1">
                <DocumentView
                  imgUrl={
                    birthCertificate
                      ? URL.createObjectURL(birthCertificate)
                      : data?.birthCertificate
                  }
                />
                <DocumentDownload
                  imgUrl={
                    birthCertificate
                      ? URL.createObjectURL(birthCertificate)
                      : data?.birthCertificate
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => {
                // console.log(birthCertificate);
                const formData = new FormData();
                formData.append(
                  "birthCertificate",
                  birthCertificate!,
                  birthCertificate?.name
                );
                FileUpdate.mutate(formData);
              }}
            >
              Submit
            </Button>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex gap-2 items-end">
              <div>
                <div className="text-sm font-medium">Aadhar Card</div>
                <Input
                  type="file"
                  onChange={(e) => {
                    setAadharCard(e.target.files?.[0] || ({} as File));
                  }}
                ></Input>
              </div>
              <div className="flex gap-1">
                <DocumentView
                  imgUrl={
                    aadharCard
                      ? URL.createObjectURL(aadharCard)
                      : data?.adharCard
                  }
                />
                <DocumentDownload
                  imgUrl={
                    aadharCard
                      ? URL.createObjectURL(aadharCard)
                      : data?.adharCard
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => {
                // console.log(aadharCard);
                const formData = new FormData();
                formData.append("aadharCard", aadharCard!, aadharCard?.name);
                FileUpdate.mutate(formData);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;
