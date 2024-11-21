import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Axios from "@/Axios/Axios";
import { competitionSchema } from "../schemas/competitionRegistration";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = competitionSchema;

const CreateCompetition = () => {
  const items = [
    { id: "subJunior", label: "Sub Junior" },
    { id: "junior", label: "Junior" },
    { id: "open", label: "Open" },
  ] as const;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      organizer: "",
      organiserContact: "",
      zone: "",
      ageGroup: [],
    },
  });

  const { toast } = useToast();

  const createCompetition = async (
    competitionData: z.infer<typeof formSchema>
  ) => {
    const formData = new FormData();

    for (const key in competitionData) {
      if (key === "posterImage") {
        const posterFile = (competitionData[key] as FileList)[0];
        formData.append(key, posterFile);
      } else if (key === "startDate" || key === "endDate") {
        formData.append(
          key,
          new Date(competitionData[key] as string).toISOString()
        );
      } else {
        const value = competitionData[key as keyof typeof competitionData];
        if (typeof value === "string" || Array.isArray(value)) {
          formData.append(key, value.toString());
        }
      }
    }

    try {
      const response = await Axios.post(
        "/api/v1/competitions/create",
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
      console.log(error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error("Competition with the same title already exists.");
      } else {
        throw new Error("Competition creation failed. Please try again.");
      }
    }
  };

  const createCompetitionMutation = useMutation({
    mutationKey: ["createCompetition"],
    mutationFn: createCompetition,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Creation Failed !!",
        description: `${error}`,
      });
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Competition Created Successfully",
      });
    },
  });

  const onSubmit = (competitionData: z.infer<typeof formSchema>) => {
    createCompetitionMutation.mutate(competitionData);
  };

  const posterImageRef = form.register("posterImage", { required: true });

  return (
    <Card className="max-w-2xl sm:mx-auto mx-4 p-4 my-32">
      <CardHeader>
        <CardTitle className="text-3xl font-black text-slate-700">
          Create Competition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter competition title" {...field} />
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
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date*</FormLabel>
                  <Input type="date" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date*</FormLabel>
                  <Input type="date" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organizer */}
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organiser Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organizer Contact */}
            <FormField
              control={form.control}
              name="organiserContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Contact*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age Group Selection with Checkboxes */}
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
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  checked
                                    ? [...field.value, item.id]
                                    : field.value.filter(
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
                      )}
                    />
                  ))}
                  <FormMessage />
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
                  <FormControl>
                    <Input placeholder="Enter zone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Poster Image */}
            <FormField
              control={form.control}
              name="posterImage"
              render={() => (
                <FormItem>
                  <FormLabel>Poster Image*</FormLabel>
                  <FormControl>
                    <Input type="file" {...posterImageRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={createCompetitionMutation.isPending}
            >
              {createCompetitionMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateCompetition;
