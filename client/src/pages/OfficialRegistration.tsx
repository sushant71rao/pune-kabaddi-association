"use client";

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
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { officialRegistrationSchema } from "@/schemas/officialRegistrationSchema";
import { useState } from "react";

const formSchema = officialRegistrationSchema;

import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Axios from "@/Axios/Axios";

const OfficialRegistration = () => {
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      passingYear: "",
      gender: "",
      adharNumber: "",
      password: "",
    },
  });

  form.watch();

  const { toast } = useToast();

  const registerOfficial = async (officialData: z.infer<typeof formSchema>) => {
    {
      const formData = new FormData();

      for (const key in officialData) {
        if (key === "adharCard") {
          const adharCardFile = (officialData[key] as FileList)[0];
          formData.append(key, adharCardFile);
        } else if (key == "avatar") {
          const avatarFile = (officialData[key] as FileList)[0];
          formData.append(key, avatarFile);
        } else if (key == "passingCertificate") {
          const passingCertificateFile = (officialData[key] as FileList)[0];
          formData.append(key, passingCertificateFile);
        } else {
          const validKey = key as keyof typeof officialData;
          const value = officialData[validKey];

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
        const response = await Axios.post(
          "/api/v1/officials/register-official",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
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

  const registerOfficialMutation = useMutation({
    mutationKey: ["registerOfficial"],
    mutationFn: registerOfficial,
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

  const onSubmit = (officialData: z.infer<typeof formSchema>) => {
    console.log(officialData);
    registerOfficialMutation.mutate(officialData);
  };

  const avatarFileRef = form.register("avatar", { required: true });
  const adharCardFileRef = form.register("adharCard", { required: true });
  const passingCertificateFileRef = form.register("passingCertificate");

  return (
    <Card className="max-w-2xl sm:mx-auto mx-4 p-4 my-32">
      <CardHeader>
        <CardTitle className="text-3xl font-black text-slate-700">
          Official Registration
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
                      <Input placeholder="Your name" {...field} />
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

            {/* Avatar */}
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

            {/* Passing Year */}
            <FormField
              control={form.control}
              name="passingYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passing Year*</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your passing year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Passing Certificate */}
            <FormField
              control={form.control}
              name="passingCertificate"
              render={() => (
                <FormItem>
                  <FormLabel>Passing Certificate</FormLabel>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      {...passingCertificateFileRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Adhar Number and Card */}
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="adharNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Adhar Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Write your adhar number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adharCard"
                render={() => (
                  <FormItem>
                    <FormLabel>Adhar Card</FormLabel>
                    <FormControl>
                      <Input id="picture" type="file" {...adharCardFileRef} />
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

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={registerOfficialMutation.isPending}
            >
              {registerOfficialMutation.isPending ? (
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
              {registerOfficialMutation.error &&
                registerOfficialMutation.error?.message}{" "}
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OfficialRegistration;
