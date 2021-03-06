import { formatDate } from "../../utils/dateUtils";
import {
  GridActionsCellItem,
  getGridNumericOperators,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ALLOWED_NUMERIC_OPERATORS = ["=", "!=", ">", ">=", "<", "<="];
const ALLOWED_STRING_OPERATORS = ["contains"];
const ALLOWED_DATE_OPERATORS = ["is"];
const numericFilterOptions = getGridNumericOperators().filter((op) =>
  ALLOWED_NUMERIC_OPERATORS.includes(op.value)
);
const stringFilterOptions = getGridStringOperators().filter((op) =>
  ALLOWED_STRING_OPERATORS.includes(op.value)
);
const dateFilterOptions = getGridDateOperators().filter((op) =>
  ALLOWED_DATE_OPERATORS.includes(op.value)
);

export const columns = [
  //   { field: 'id', headerName: 'ID', width: 90 },
  {
    field: "amount",
    headerName: "Amount",
    description: "Amount",
    type: "number",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    hideable: false,
    filterOperators: numericFilterOptions,
  },
  {
    field: "type",
    headerName: "Type",
    description: "Type",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    hideable: false,
    valueGetter: (params) => `${params.row.type?.toUpperCase()}`,
    filterOperators: stringFilterOptions,
  },
  {
    field: "category_name",
    headerName: "Category",
    description: "Category",
    width: 190,
    headerAlign: "center",
    align: "center",
    editable: false,
    filterOperators: stringFilterOptions,
  },
  {
    field: "date",
    headerName: "Date",
    description: "Date",
    type: "date",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    filterOperators: dateFilterOptions,
    valueFormatter: (params) => {
      return `${formatDate(params.value)}`;
    },
  },
  {
    field: "description",
    headerName: "Description",
    description: "Description",
    sortable: false,
    width: 275,
    headerAlign: "center",
    align: "center",
    hide: false,
    filterOperators: stringFilterOptions,
  },
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={(params) => () => {
          console.log("Edit item : ", params);
        }}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={(params) => () => {
          console.log("delete item : ", params);
        }}
      />,
    ],
  },
];

export default columns;
