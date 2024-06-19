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
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";

const formSchema = officialProfileSchema;

import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Axios from "@/Axios/Axios";
import {
  officialProfileSchema,
  OfficialType,
} from "@/schemas/officialProfileSchema";
import { useParams } from "react-router-dom";
import DocumentDownload from "./DocumentDownload";
import DocumentView from "@/components/DocumentView";

const OfficialProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState<File>();
  const [passingCertificate, setPassingCertificate] = useState<File>();
  const [aadharCard, setAadharCard] = useState<File>();
  const { id } = useParams();

  const fetchOfficials = useQuery<OfficialType | undefined>({
    queryKey: ["official", id],
    queryFn: async () => {
      try {
        const response = await Axios.get(
          `/api/v1/officials/get-official/${id}`
        );
        // console.log(response.data.data);
        return response.data.data as OfficialType;
      } catch (error) {
        console.log("error while fetching officials", error);
      }
    },
  });

  let { data } = fetchOfficials;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      middleName: data?.middleName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phoneNo: data?.phoneNo || "",
      passingYear: data?.passingYear || "",
      gender: data?.gender || "",
      adharNumber: data?.adharNumber || "",
    },
  });

  useEffect(() => {
    if (fetchOfficials.isSuccess) {
      form.reset(data);
    }
  }, [fetchOfficials.isSuccess, data, form]);

  form.watch();

  const { toast } = useToast();

  const registerOfficial = async (officialData: z.infer<typeof formSchema>) => {
    console.log(officialData);
    {
      const formData = form.getValues();

      try {
        const response = await Axios.patch(
          `/api/v1/officials/update-official-details/${id}`,
          {
            ...formData,
          }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          throw new Error("Failed to update");
        } else {
          throw new Error("Player registration failed. Please try again.");
        }
      }
    }
  };

  const FileUpdate = useMutation({
    mutationKey: ["fileupdate"],
    mutationFn: async (files: any) => {
      try {
        let response = await Axios.patch(
          `/api/v1/officials/update-files/${id}`,
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

  const registerOfficialMutation = useMutation({
    mutationKey: ["registerOfficial"],
    mutationFn: registerOfficial,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed !!",
        description: `${error}`,
      });
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Official Updated Successfully",
      });
    },
  });

  const onSubmit = (officialData: z.infer<typeof formSchema>) => {
    // console.log(officialData);
    registerOfficialMutation.mutate(officialData);
  };

  return (
    <Card className="max-w-2xl sm:mx-auto mx-4 p-4 my-32">
      <CardHeader>
        <CardTitle className="text-3xl font-black text-slate-700">
          Official Profile
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
            </div>

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
                <div className="text-sm font-medium">Passing Certificate</div>
                <Input
                  type="file"
                  onChange={(e) => {
                    setPassingCertificate(
                      e?.target?.files?.[0] || ({} as File)
                    );
                  }}
                ></Input>
              </div>
              <div className="flex gap-1">
                <DocumentView
                  imgUrl={
                    passingCertificate
                      ? URL.createObjectURL(passingCertificate)
                      : data?.passingCertificate
                  }
                />
                <DocumentDownload
                  imgUrl={
                    passingCertificate
                      ? URL.createObjectURL(passingCertificate)
                      : data?.passingCertificate
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => {
                // console.log(passingCertificate);
                const formData = new FormData();
                formData.append(
                  "passingCertificate",
                  passingCertificate!,
                  passingCertificate?.name
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

export default OfficialProfile;
