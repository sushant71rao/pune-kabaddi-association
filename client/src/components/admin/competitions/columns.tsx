import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteCompetition from "@/lib/delete-competition";

export interface Competition {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizer: string;
  organiserContact: string;
  zone: string;
  ageGroup: string[];
  teams: string[];
  players: string[];
  posterImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const competitionColumns: ColumnDef<Competition>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Organizer",
    accessorKey: "organizer",
  },
  {
    header: "Contact",
    accessorKey: "organiserContact",
  },
  {
    header: "Zone",
    accessorKey: "zone",
  },
  {
    header: "Age Group",
    accessorKey: "ageGroup",
    cell: ({ row }) => (row.getValue("ageGroup") as any[])?.join(", "),
  },
  {
    header: "Teams",
    accessorKey: "teams",
    cell: ({ row }) => (row.getValue("teams") as any[])?.length,
  },
  {
    header: "Players",
    accessorKey: "players",
    cell: ({ row }) => (row.getValue("players") as any[])?.length,
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Start Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "startDate",
    cell: ({ row }) =>
      new Date(row.getValue("startDate"))?.toLocaleDateString(),
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    cell: ({ row }) => new Date(row.getValue("endDate"))?.toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.getValue("_id");
      const navigate = useNavigate();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigate(`/admin/competition/${id}`)}
            >
              <Button className="w-full">View</Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteCompetition id={id as string} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    header: "ID",
    accessorKey: "_id",
  },
];
