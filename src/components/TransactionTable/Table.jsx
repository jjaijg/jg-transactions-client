import { useState, useEffect, useMemo, useCallback } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { columns } from "./columns";
import CustomToolbar from "./CustomToolbar";

function Table({
  transactions = [],
  pagSize,
  rowsPerPageOptions,
  rowCount,
  setPage,
  setPageSize,
  loading,
  handleFilterChange,
  handleSortChange,
  handleEdit,
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

  const onPageChange = useCallback(
    (page) => {
      setPage(page + 1);
    },
    [setPage]
  );

  const onPageSizeChange = useCallback(
    (newSize) => {
      setPageSize(newSize);
    },
    [setPageSize]
  );

  const onFilterChange = useCallback(
    (model, details) => {
      handleFilterChange(model, details);
    },
    [handleFilterChange]
  );

  const onSortChange = useCallback(
    (model, details) => {
      handleSortChange(model, details);
    },
    [handleSortChange]
  );

  const onEdit = useCallback(
    (row) => () => {
      // console.log("editing : ", row.row);
      handleEdit(row.row);
    },
    [handleEdit]
  );

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
            onClick={onEdit(params)}
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
    [onDelete, onEdit, loading]
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
        pagination
        paginationMode="server"
        filterMode="server"
        sortingMode="server"
        loading={loading}
        components={{
          Toolbar: CustomToolbar,
        }}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onFilterModelChange={onFilterChange}
        onSortModelChange={onSortChange}
        // checkboxSelection
        // componentsProps={{
        //   footer: { count: rowCountState },
        // }}

        // disableSelectionOnClick
      />
    </>
  );
}

export default Table;
