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

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  teamRegistrationSchema,
  TeamType,
} from "@/schemas/teamRegistrationSchema";

import { useToast } from "@/components/ui/use-toast";
import Axios from "@/Axios/Axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useParams } from "react-router-dom";

const formSchema = teamRegistrationSchema;

const TeamProfile = () => {
  const { id } = useParams();

  const fetchTeamQuery = useQuery<TeamType | undefined>({
    queryKey: ["team"],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/api/v1/teams/get-team/${id}`);
        // console.log(response.data.data);
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
      teamName: "",
      email: "",
      phoneNo: "",
      address: "",
      category: "",
      ageGroup: [],
      pinCode: "",
      authorizedPersonName: "",
      authorizedPersonPhoneNo: "",
      managerName: "",
      managerPhoneNo: "",
      password: "",
      description: "",
    },
  });

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
  form.watch();

  const registerTeam = async (teamData: z.infer<typeof formSchema>) => {
    // console.log(teamData);
    {
      const formData = new FormData();
      for (const key in teamData) {
        if (key === "logo") {
          const logoFile = (teamData[key] as FileList)[0];
          // console.log(logoFile);
          formData.append(key, logoFile);
        } else {
          // Use keyof to ensure that key is a valid property of teamData
          const validKey = key as keyof typeof teamData;

          const value = teamData[validKey];

          if (validKey === "startingYear" && value instanceof Date) {
            formData.append(validKey, value.toISOString());
          } else if (typeof value === "string" || typeof value === "number") {
            formData.append(validKey, value.toString());
          } else if (typeof value === typeof []) {
            formData.append(validKey, JSON.stringify(value));
          } else {
            console.warn(`Unsupported type for field '${validKey}'`);
          }
        }
      }

      // console.log(formData);
      try {
        const response = await Axios.post(
          "/api/v1/teams/register-team",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          throw new Error("Team Name or Email already exists");
        } else {
          throw new Error("Team registration failed. Please try again");
        }
      }
    }
  };

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
        description: "Team Registered Successfully",
      });
    },
  });
  const [open, setOpen] = useState(false);
  const fileRef = form.register("logo", { required: true });

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

            {/* Logo */}
            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Team Logo</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
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
                  <FormLabel>Starting Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>pick starting date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={(date) => {
                          // setDate(date);
                          // calculateAge(date);
                          field.onChange(date);
                        }}
                        fromYear={1960}
                        toYear={2024}
                      />
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
                  {/* <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Choose your pinCode" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        {PinCodes?.map((ele) => {
                          return (
                            <>
                              <SelectItem value={ele.toString()}>
                                {ele}
                              </SelectItem>
                            </>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </CardContent>
    </Card>
  );
};

export default TeamProfile;
