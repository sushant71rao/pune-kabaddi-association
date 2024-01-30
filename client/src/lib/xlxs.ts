import xlsx, { IJsonSheet } from "json-as-xlsx";
import { people } from "../constants/people";

export function downloadToExcel() {
  let columns: IJsonSheet[] = [
    {
      sheet: "Persons",
      columns: [
        { label: "Person ID", value: "id" },
        { label: "First Name", value: "first_name" },
        { label: "Last Name", value: "last_name" },
        { label: "Email", value: "email" },
        { label: "Gender", value: "gender" },
      ],
      content: people,
    },
  ];

  let settings = {
    fileName: "People Excel",
  };

  xlsx(columns, settings);
}
