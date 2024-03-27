import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Axios from "../../Axios/Axios";
import MaxWidthWrapper from "../MaxWidthWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import signInSchema from "@/schemas/signInSchema";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

const FormSchema = signInSchema;

const RegisterSingIn = () => {
  let { getuser, getteam } = useContext(AuthContext);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //urlstate
  let [link, setLink] = useState<string>("players");

  const login = async (signInData: z.infer<typeof FormSchema>) => {
    try {
      const response = await Axios.post(`/api/v1/${link}/login`, signInData, {
        withCredentials: true,
      });

      const resdata = response?.data;

      if (link == "teams") {
        getteam?.(resdata?.data?.user);
      } else {
        getuser?.(resdata?.data?.user);
      }
      // console.log(user);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login");
    }
  };

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
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

  function onSubmit(signInData: z.infer<typeof FormSchema>) {
    loginMutation.mutate(signInData);
  }

  return (
    <MaxWidthWrapper>
      <div className="flex sm:flex-row flex-col gap-4 ">
        <Card className="w-full sm:w-4/5">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-slate-700">
              Register
            </CardTitle>
            <CardDescription className="mt-2 mb-5 text-base leading-tight text-gray-600">
              Register yourself here with your relevant Community!
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Link to="/player-registration" className="w-full">
              <Button className="w-full">As Player</Button>
            </Link>
            <Link to="/team-registration" className="w-full">
              <Button className="w-full">As Team</Button>
            </Link>
            <Link to="/official-registration" className="w-full">
              <Button className="w-full">As Umpire</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="w-full sm:w-4/5">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-slate-700">
              Sign In
            </CardTitle>
            <CardDescription className="mt-2 mb-5 text-base leading-tight text-gray-600">
              Sign In if you already have a account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(e) => {
                          setLink(e);
                        }}
                        defaultValue="players"
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            defaultValue={"players"}
                            placeholder="Select The Role"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="players">Player</SelectItem>
                            <SelectItem value="teams">Team</SelectItem>
                            <SelectItem value="officials">Umpire</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter your password" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
};

export default RegisterSingIn;
