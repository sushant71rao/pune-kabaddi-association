"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { teamProfileSchema, TeamType } from "@/schemas/teamProfileSchema";

import { useToast } from "@/components/ui/use-toast";
import Axios from "@/Axios/Axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DocumentDownload from "./DocumentDownload";
import DocumentView from "@/components/DocumentView";

const formSchema = teamProfileSchema;

const TeamProfile = () => {
  const [logo, setLogo] = useState<File>();
  const { id } = useParams();

  const fetchTeamQuery = useQuery<TeamType | undefined>({
    queryKey: ["team", id],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/api/v1/teams/get-team/${id}`);

        return response.data.data as TeamType;
      } catch (error) {
        console.log("error while fetching teams", error);
      }
    },
  });

  let { data } = fetchTeamQuery;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: data?.teamName || "",
      email: data?.email || "",
      phoneNo: data?.phoneNo || "",
      address: data?.address || "",
      startingYear: data?.startingYear || "",
      category: data?.category || "",
      ageGroup: data?.ageGroup || [],
      pinCode: data?.pinCode || "",
      authorizedPersonName: data?.authorizedPersonName || "",
      authorizedPersonPhoneNo: data?.authorizedPersonPhoneNo || "",
      managerName: data?.managerName || "",
      managerPhoneNo: data?.managerPhoneNo || "",
      description: data?.description || "",
    },
  });

  useEffect(() => {
    if (fetchTeamQuery.isSuccess) {
      form.reset(data);
    }
  }, [fetchTeamQuery.isSuccess, data, form]);

  const items = [
    {
      id: "subJunior",
      label: "Sub Junior",
    },
    {
      id: "junior",
      label: "Junior",
    },
    {
      id: "open",
      label: "Open",
    },
  ] as const;

  const PinCodes = [
    411013, 412029, 411028, 412307, 411036, 411040, 411014, 411001, 411011,
    411009, 411024, 411041, 411038, 411003, 411053, 411004, 411055, 411005,
    410056, 411018, 411012, 411019, 410506, 411015, 411020, 411017, 411026,
    411039, 412061, 412105, 410401, 410505, 410502, 411046, 413801, 410014,
    411002, 410038, 411000, 412206, 412212, 412108, 413106, 413102, 413133,
    412301,
  ];

  const years: number[] = [];
  for (let year = 1950; year <= 2025; year++) {
    years.push(year);
  }

  form.watch();

  const registerTeam = async (teamData: z.infer<typeof formSchema>) => {
    {
      console.log(teamData);
      let formData = form.getValues();
      console.log("team form data", formData);

      try {
        const response = await Axios.patch(
          `/api/v1/teams/update-team-details/${id}`,
          { ...formData }
        );

        return response.data;
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          throw new Error("failed to update team details");
        } else {
          throw new Error("Team registration failed. Please try again");
        }
      }
    }
  };

  const FileUpdate = useMutation({
    mutationKey: ["logoUpdate"],
    mutationFn: async (files: any) => {
      try {
        let response = await Axios.patch(
          `/api/v1/teams/update-logo/${id}`,
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
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Document Updated Successfully",
      });
    },
  });

  const registerTeamMutation = useMutation({
    mutationKey: ["registerTeam"],
    mutationFn: registerTeam,
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
        description: "Team Updated Successfully",
      });
    },
  });
  const [open, setOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  // const fileRef = form.register("logo", { required: true });

  const onSubmit = (teamData: z.infer<typeof formSchema>) => {
    registerTeamMutation.mutate(teamData);
  };

  return (
    <Card className="max-w-2xl sm:mx-auto mx-4 p-4 my-32">
      <CardHeader>
        <CardTitle className="text-3xl font-black text-slate-700">
          Team Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-8"
          >
            {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>Team Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Started On */}
            <FormField
              control={form.control}
              name="startingYear"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Starting Year*</FormLabel>
                  <Popover open={yearOpen} onOpenChange={setYearOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                      >
                        {field?.value
                          ? years.find(
                              (year) => year?.toString() === field?.value
                            )
                          : "Select Starting Year"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Select PinCode" />
                        <CommandList>
                          <CommandEmpty>No year found.</CommandEmpty>
                          <CommandGroup>
                            {years.map((year) => (
                              <CommandItem
                                key={year?.toString()}
                                value={year?.toString()}
                                onSelect={(currentValue) => {
                                  field.onChange(currentValue);
                                  setYearOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === year?.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {year}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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

            {/* Age Group */}
            <FormField
              control={form.control}
              name="ageGroup"
              render={() => (
                <FormItem>
                  <FormLabel>Age Group*</FormLabel>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="ageGroup"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="write a bit about your team"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* pinCode */}
            <FormField
              control={form.control}
              name="pinCode"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Pin-Code*</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                      >
                        {field?.value
                          ? PinCodes.find(
                              (pin) => pin?.toString() === field?.value
                            )
                          : "Select Pincode"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Select PinCode" />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {PinCodes.map((pin) => (
                              <CommandItem
                                key={pin?.toString()}
                                value={pin?.toString()}
                                onSelect={(currentValue) => {
                                  field.onChange(currentValue);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === pin?.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {pin}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Authorized Person */}
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="authorizedPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorized Person Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="write persons name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorizedPersonPhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorized Person PhonNo*</FormLabel>
                    <FormControl>
                      <Input placeholder="write persons phone no." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Manager */}
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="write managers name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerPhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Managers PhonNo*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="write managers phone no."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="write a bit about your team"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={registerTeamMutation.isPending}
            >
              {registerTeamMutation.isPending ? (
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
              {registerTeamMutation.error &&
                registerTeamMutation.error?.message}{" "}
            </p>
          </form>
        </Form>
        <div className="flex flex-col gap-3 ">
          <div className="flex justify-between items-end">
            <div className="flex gap-2 items-end">
              <div>
                <div className="text-sm font-medium">Logo</div>
                <Input
                  type="file"
                  onChange={(e) => {
                    setLogo(e?.target?.files?.[0] || ({} as File));
                  }}
                ></Input>
              </div>
              <div className="flex gap-1">
                <DocumentView
                  imgUrl={logo ? URL.createObjectURL(logo) : data?.logo}
                />
                <DocumentDownload
                  imgUrl={logo ? URL.createObjectURL(logo) : data?.logo}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                const formData = new FormData();
                formData.append("logo", logo!, logo?.name);
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

export default TeamProfile;
