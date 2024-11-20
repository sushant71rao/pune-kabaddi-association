import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // You can import your Button component
import { Input } from "@/components/ui/input"; // You can import your Input component
import { useParams } from "react-router-dom";

const RegisterTeamButton = () => {
  const { id } = useParams(); // Assuming you need the competition ID from params
  const [teamName, setTeamName] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (!teamName.trim()) {
      alert("Please enter a valid team name!");
    } else {
      alert(`Team '${teamName}' registered for competition with ID: ${id}`);
      // Perform the team registration logic here (API call)
      setDialogOpen(false); // Close the dialog
    }
  };

  return (
    <div className="flex justify-center w-full">
      {/* Button to open the Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition duration-200">
            Register Your Team
          </Button>
        </DialogTrigger>

        {/* Dialog content for team registration */}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Your Team</DialogTitle>
            <DialogDescription>
              Enter your team's name below to register for the competition.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="mr-4"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterTeamButton;
