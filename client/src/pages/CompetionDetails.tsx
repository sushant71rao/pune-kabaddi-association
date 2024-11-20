import React from "react";
import { useParams } from "react-router-dom";
import Axios from "@/Axios/Axios";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@/schemas/types";
import RegisterTeamButton from "@/components/CompetitionDialog";

const CompetitionDetails = () => {
  const { id } = useParams();

  const getCompetition = async () => {
    try {
      const res = await Axios.get(`/api/v1/competitions/get/${id}`);
      return res.data?.data;
    } catch (err) {
      console.error("Error", err);
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
    return (
      <div className="text-center text-lg font-semibold animate-pulse text-gray-700">
        Loading...
      </div>
    );
  }

  if (isError || !competition) {
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Failed to load competition details.
      </div>
    );
  }

  const handleRegister = () => {
    alert(`Register your team for the competition: ${competition.title}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 text-gray-800">
      {/* Image Section */}
      <div className="w-full max-w-4xl">
        <div className="relative w-full h-80 bg-gray-100 overflow-hidden rounded-lg shadow-lg border-2 border-black">
          {competition.posterImage ? (
            <img
              src={competition.posterImage}
              alt="Competition Poster"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-3xl font-bold text-gray-500">No Image</span>
          )}
        </div>
      </div>

      {/* Title Section */}
      <h1 className="mt-6 text-4xl font-extrabold text-gray-900 text-center">
        {competition.title}
      </h1>

      {/* Organizer Details */}
      <p className="text-gray-700 text-center mt-2">
        Organized by{" "}
        <span className="font-bold text-red-600">{competition.organizer}</span>{" "}
        | Contact:{" "}
        <span className="font-semibold">{competition.organiserContact}</span>
      </p>

      {/* Key Information Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 w-full max-w-4xl md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          label="Start Date"
          value={new Date(competition.startDate).toLocaleDateString()}
        />
        <InfoCard
          label="End Date"
          value={new Date(competition.endDate).toLocaleDateString()}
        />
        <InfoCard label="Location" value={competition.location} />
        <InfoCard label="Zone" value={competition.zone} />
        <InfoCard
          label="Age Group"
          value={
            competition.ageGroup.length > 0
              ? competition.ageGroup.join(", ")
              : "N/A"
          }
        />
      </div>

      {/* Register Button */}
      <div className="mt-10">
        <RegisterTeamButton />
      </div>
      {/* Description */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2">
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          {competition.description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="mt-12 w-full max-w-4xl">
        <p className="text-center text-sm text-gray-500">
          Created At: {new Date(competition.createdAt || "").toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Component for reusable info cards
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-300">
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    <p className="text-xl font-bold text-black mt-1">{value}</p>
  </div>
);

export default CompetitionDetails;
