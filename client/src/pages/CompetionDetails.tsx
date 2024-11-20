import React from "react";
import { useParams } from "react-router-dom";
import Axios from "@/Axios/Axios";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@/schemas/types";

const CompetitionDetails = () => {
  const { id } = useParams();

  const getCompetition = async () => {
    try {
      const res = await Axios.get(`/api/v1/competitions/get/${id}`);
      return res.data?.data;
    } catch (err) {
      console.log("Error", err);
      return undefined;
    }
  };

  const {
    data: competition,
    isLoading,
    isError,
  } = useQuery<Competition>({
    queryKey: ["competition", id],
    queryFn: getCompetition,
  });

  if (isLoading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (isError || !competition) {
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Failed to load competition details.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {competition.title}
        </h1>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Description:</span>{" "}
          {competition.description}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Location:</span>{" "}
          {competition.location}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Organizer:</span>{" "}
          {competition.organizer}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Contact:</span>{" "}
          {competition.organiserContact}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Zone:</span> {competition.zone}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Age Groups:</span>{" "}
          {competition.ageGroup.join(", ")}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Start Date:</span>{" "}
          {new Date(competition.startDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">End Date:</span>{" "}
          {new Date(competition.endDate).toLocaleDateString()}
        </p>
        {competition.posterImage && (
          <div className="mt-4">
            <img
              src={competition.posterImage}
              alt={`${competition.title} Poster`}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetails;
