"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
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

import * as z from "zod"
import { Button } from "@/components/ui/button";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { teamRegistrationSchema } from "@/schemas/teamRegistrationSchema";

import { useToast } from "@/components/ui/use-toast"


const formSchema = teamRegistrationSchema



const TeamRegistration = () => {

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "ramlal",
      email: "ramlal@gmail.com",
      phoneNo: "7896587452",
      category: "",
      ageGroup: "",
      zone: "",
      authorizedPersonName: "tomm",
      authorizedPersonPhoneNo: "7896857456",
      managerName: "killer",
      managerPhoneNo: "7896857453",
      password: "rajesh@",
      description: "noice",
      logo: undefined,
    }

  });

  form.watch();

  const registerTeam = async (teamData: z.infer<typeof formSchema>) => {
    {
      const formData = new FormData();

      for (const key in teamData) {
        if (key === 'logo') {
          const logoFile = (teamData[key] as FileList)[0];
          formData.append(key, logoFile);
        } else {
          // Use keyof to ensure that key is a valid property of teamData
          const validKey = key as keyof typeof teamData;
          const value = teamData[validKey];

          if (validKey === 'startingYear' && value instanceof Date) {
            formData.append(validKey, value.toISOString());
          } else if (typeof value === 'string' || typeof value === 'number') {
            formData.append(validKey, value.toString());
          } else {
            console.warn(`Unsupported type for field '${validKey}'`);
          }
        }
      }

      try {
        const response = await axios.post('/api/v1/teams/register-team', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return response.data

      } catch (error) {

        if (axios.isAxiosError(error) && error.response?.status === 409) {
          throw new Error('Team Name or Email already exists');
        } else {
          throw new Error('Team registration failed. Please try again.');
        }
      }
    }
  }

  const registerTeamMutation = useMutation({
    mutationKey: ['registerTeam'],
    mutationFn: registerTeam,
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Registration Failed !!',
        description: `${error}`,
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Team Registered Successfully',
      });
    }

  });


  const fileRef = form.register('logo', { required: true });

  const onSubmit = (teamData: z.infer<typeof formSchema>) => {


    console.log(teamData)
    registerTeamMutation.mutate(teamData);



  };
  console.log(registerTeamMutation)
  return (
    <Card className="max-w-2xl sm:mx-auto mx-4 p-4 my-32">
      <CardHeader>
        <CardTitle className="text-3xl font-black text-slate-700">
          Team Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-8" >

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
                    <Input type="file"   {...fileRef} />
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age Group */}
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
                        <SelectItem value="m">
                          Male
                        </SelectItem>
                        <SelectItem value="f">
                          Female
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Group*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select Age Group" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="subJunior">
                          Sub Junior
                        </SelectItem>
                        <SelectItem value="junior">
                          Junior
                        </SelectItem>
                        <SelectItem value="open">
                          Open
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Zone */}
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Choose your Zone" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="789654">
                          411 355
                        </SelectItem>
                        <SelectItem value="758965">
                          789 456
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                      <Input placeholder="write managers phone no." {...field} />
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

            <Button type="submit" className="w-full mt-4" disabled={registerTeamMutation.isPending}>
              {registerTeamMutation.isPending ? (<>Submitting <img src="/assets/loading.svg" alt="loading" className="w-6 h-6 ml-4" /> </>) : 'Submit'}

            </Button>

            <p className="text-red-600 font-semibold">{registerTeamMutation.error && registerTeamMutation.error?.message} </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TeamRegistration;
