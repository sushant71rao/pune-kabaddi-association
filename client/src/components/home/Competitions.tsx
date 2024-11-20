"use client";

import { Button } from "../ui/button";
import Heading from "../Heading";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Card, CardContent } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import Axios from "@/Axios/Axios";
import { Link } from "react-router-dom";

interface Competition {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  posterImage: string;
}

const fetchCompetitions = async (): Promise<Competition[]> => {
  const response = await Axios.get("/api/v1/competitions/get");
  return response.data;
};

const Competitions = () => {
  const {
    data: competitions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["competitions"],
    queryFn: fetchCompetitions,
  });

  if (isLoading) {
    return <div>Loading competitions...</div>;
  }

  if (isError) {
    return <div>Failed to load competitions. Please try again later.</div>;
  }

  return (
    <MaxWidthWrapper className="max-w-screen-2xl">
      <Heading heading="Upcoming Events" />
      <div className="flex gap-4 items-stretch justify-center">
        {competitions?.map((competition) => (
          <Card key={competition._id} className="h-62 max-w-xl flex-1">
            <a
              href="#"
              className="flex flex-col items-center bg-white  rounded-lg md:flex-row "
            >
              <img
                src={
                  competition.posterImage || "https://via.placeholder.com/150"
                }
                alt={competition.title}
                className="object-cover aspect-[1] h-40"
              />
              <CardContent className="h-full">
                <div className="flex flex-col p-4 rounded-lg h-full">
                  <span className="text-sm text-gray-500 mb-4">
                    Date: {new Date(competition.startDate).toLocaleDateString()}
                  </span>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-700 dark:text-white line-clamp-1">
                    {competition.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 line-clamp-2">
                    {competition.description}
                  </p>
                  <Link
                    to={`/competition-details/${competition._id}`}
                    className="p-2"
                  >
                    Read more
                  </Link>
                </div>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default Competitions;
