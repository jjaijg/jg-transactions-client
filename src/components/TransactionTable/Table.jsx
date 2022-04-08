import { useState, useEffect, useMemo, useCallback } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { columns } from "./columns";

import CustomToolbar from "./CustomToolbar";
// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarColumnsButton />
//       <GridToolbarFilterButton />
//       <GridToolbarDensitySelector />
//       <GridToolbarExport />
//       <FilterMenu />
//     </GridToolbarContainer>
//   );
// }

function Table({
  transactions = [],
  pagSize,
  rowsPerPageOptions,
  rowCount,
  setPage,
  setPageSize,
  loading,
  handleDelete,
  // groupBy,
  // setGroupBy,
  // txnGrpDate,
  // setTxnGrpDate,
  // filterOpen,
  // setFilterOpen,
}) {
  const [rowCountState, setRowCountState] = useState(rowCount);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState
    );
  }, [rowCount, setRowCountState]);

  const onDelete = useCallback(
    (id) => () => {
      console.log(id);
      handleDelete(id);
    },
    [handleDelete]
  );
  const tableColumns = useMemo(
    () => [
      ...columns,
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            disabled={loading}
            onClick={(params) => () => {
              console.log("Edit item : ", params);
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            disabled={loading}
            onClick={onDelete(params.row._id)}
          />,
        ],
      },
    ],
    [onDelete, loading]
  );

  return (
    <>
      <DataGrid
        getRowId={(row) => row._id}
        columns={tableColumns}
        rows={transactions}
        rowCount={rowCountState}
        pageSize={pagSize}
        rowsPerPageOptions={rowsPerPageOptions}
        // checkboxSelection
        pagination
        paginationMode="server"
        loading={loading}
        components={{
          Toolbar: CustomToolbar,
          // Toolbar: () =>
          //   CustomToolbar({
          //     groupBy,
          //     setGroupBy,
          //     txnGrpDate,
          //     setTxnGrpDate,
          //     filterOpen,
          //     setFilterOpen,
          //   }),
          // Toolbar: GridToolbar,
        }}
        onPageChange={(page) => {
          setPage(page + 1);
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
        }}
        onFilterModelChange={(model, details) => {
          console.log("Filtering : ", model, details);
        }}

        // disableSelectionOnClick
      />
    </>
  );
}

export default Table;
