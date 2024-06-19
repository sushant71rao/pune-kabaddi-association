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
import DeleteTeam from "@/lib/delete-team";

type Player = {
  _id: string;

  email: string;
  teamName: string;
  gender: string;
  phoneNo: string;
  dateOfBirth: Date;
  idCard: string;
};

export const columns: ColumnDef<Player>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    header: "Email",
    accessorKey: "email",

    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    header: "Team Name",
    accessorKey: "teamName",

    cell: ({ row }) => <div>{row.getValue("teamName")}</div>,
  },
  {
    header: "Phone No",
    accessorKey: "phoneNo",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    accessorKey: "category",
  },
  {
    header: "Age Group",
    accessorKey: "ageGroup",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("ageGroup")}</div>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = String(row.getValue("_id"));

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
              onClick={() => {
                navigate(`/admin/team/${id}`);
              }}
            >
              <Button>Edit</Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteTeam id={id} />
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
