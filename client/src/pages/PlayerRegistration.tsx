"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from '@tanstack/react-query'
import axios from "axios"


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
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";


import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod"
import { playerRegistrationSchema } from "@/schemas/playerRegistrationSchema";
import { teamRegistrationSchema } from "@/schemas/teamRegistrationSchema";

import { Button } from "@/components/ui/button";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from "@/components/ui/separator";


const formSchema = playerRegistrationSchema





const PlayerRegistration = () => {




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      avatar: "",
      // birthDate: null, // Assuming birthDate is a Date object
      gender: "",
      teamName: "",
      playingPosition: "",
      adharNumber: "",
      adharCard: "",
      birthCertificate: "",
      password: "",
      achievements: [{ achievementYear: "", achievementTitle: "", achievementDocument: "" }]
    },
  });

  form.watch();


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    console.log("form submitted");
  };

  const fetchTeamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/teams/get-teams');
      return response.data;
    }
  });








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
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> <FormField
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
              /> <FormField
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Photo*</FormLabel>
                  <FormControl>
                    <Input id="avatar" type="file" {...field} />
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
                            <span>Pick birth date</span>
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

            {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Your Team*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}

                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="choose team" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>

                      {fetchTeamsQuery.isPending ? <p>loading...</p> : fetchTeamsQuery.error ? <p>error while loading data </p> :
                        (fetchTeamsQuery.data.data.map((item: z.infer<typeof teamRegistrationSchema>) => {
                          return (
                            <SelectItem value={item.teamName} key={item.email}>
                              {item.teamName}
                            </SelectItem>

                          )
                        }))
                      }



                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Playing Position */}
            <FormField
              control={form.control}
              name="playingPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playing Position*</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="raider">
                          Raider
                        </SelectItem>
                        <SelectItem value="defender">
                          Defender
                        </SelectItem>
                        <SelectItem value="allRounder">
                          All Rounder
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Adhar Card */}
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="adharNumber"
                render={({ field }) => (
                  <FormItem className="md:w-fit w-full">
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
                render={({ field }) => (
                  <FormItem className="md:w-auto w-full">
                    <FormLabel>Adhar Card</FormLabel>
                    <FormControl>
                      <Input id="picture" type="file" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Birth Certificate */}
            <FormField
              control={form.control}
              name="birthCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Certificate*</FormLabel>
                  <FormControl>
                    <Input id="picture" type="file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <h4 className="font-bold">Achievements (Optional)</h4>
            {/* Achievements */}
            <AnimatePresence>
              {form.watch("achievements").map((_, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      height: { duration: 0.2 },
                    }}

                  >
                    <div key={index} className="flex flex-wrap gap-4">
                      <FormField
                        control={form.control}
                        name={`achievements.${index}.achievementYear`}
                        render={({ field }) => {
                          return (
                            <FormItem className="md:w-1/6 w-full">
                              <FormLabel >
                                Year
                              </FormLabel>
                              <FormControl >
                                <Input
                                  placeholder="Year"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name={`achievements.${index}.achievementTitle`}
                        render={({ field }) => {
                          return (
                            <FormItem className="md:w-5/12 w-full">
                              <FormLabel >
                                Achievement Title
                              </FormLabel>
                              <FormControl >
                                <Input
                                  placeholder="Title"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name={`achievements.${index}.achievementDocument`}
                        render={({ field }) => {
                          return (
                            <FormItem className="md:w-1/3 w-full">
                              <FormLabel >
                                Achievement Document
                              </FormLabel>
                              <FormControl >
                                <Input
                                  type="file"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex items-center justify-center mt-4">
              <Separator className="flex-[1]" />
              <div className="flex flex-col gap-4 items-center justify-center md:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="font-semibold"
                  onClick={() => {
                    form.setValue("achievements", [
                      ...form.watch("achievements"),
                      { achievementYear: "", achievementTitle: "", achievementDocument: "" },
                    ]);
                  }}
                >
                  Add Achievement
                  <Plus className="w-4 h-4 ml-2 text-green-500" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="font-semibold ml-2"
                  onClick={() => {
                    form.setValue("achievements", form.watch("achievements").slice(0, -1));
                  }}
                >
                  Remove Achievement
                  <Trash className="w-4 h-4 ml-2 text-red-500" />
                </Button>
              </div>
              <Separator className="flex-[1]" />
            </div>


            <Button type="submit" className="w-full mt-4">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlayerRegistration;
