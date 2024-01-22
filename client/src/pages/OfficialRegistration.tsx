"use client";

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

import { officialRegistrationSchema } from "@/schemas/OfficialRegistrationSchema";

const formSchema = officialRegistrationSchema

const OfficialRegistration = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            passingYear: "",
            avatar: "",
            // birthDate: new Date(),
            gender: "",
            adharNumber: "",
            adharCard: "",
            password: "",
        }
    })

    form.watch();



    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log("form submitted");
    };

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

                        {/* Phone Number */}
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



                        {/* Adhar Card */}
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adhar Card</FormLabel>
                                        <FormControl>
                                            <Input id="picture" type="file" {...field} />
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



                        <Button type="submit" className="w-full mt-4">
                            Submit
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default OfficialRegistration;
