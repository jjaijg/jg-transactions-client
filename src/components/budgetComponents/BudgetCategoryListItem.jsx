import React from "react";
import { Grid, Typography, Fab, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { addElipsis } from "../../utils/budgetUtils";

function BudgetCategoryListItem({
  budgetCat,
  handleEditBudgetCatOpen,
  handleDeleteBudgetCat,
  isLoading,
}) {
  // console.log("budget cat : ", budgetCat);

  const handleDelete = (id) => () => {
    if (window.confirm("Category will be permanently deleted, are you sure?"))
      handleDeleteBudgetCat(id);
  };
  return (
    <>
      <Grid container spacing={2} my={0.4}>
        <Grid item xs={3}>
          <Tooltip title={budgetCat.category_name} placement="top">
            <Typography textAlign={"center"} variant="subtitle1">
              {addElipsis(budgetCat.category_name, 25)}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Typography textAlign={"center"} variant="subtitle1">
            {budgetCat.planned}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography textAlign={"center"} variant="subtitle1">
            {budgetCat.actual}
          </Typography>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Fab
            size="small"
            color="info"
            aria-label="edit budget"
            sx={{
              minHeight: "25px",
              height: "25px",
              width: "25px",
              mx: 1,
            }}
            onClick={handleEditBudgetCatOpen(budgetCat)}
            disabled={isLoading}
          >
            <EditIcon fontSize="10" />
          </Fab>
          <Fab
            size="small"
            color="error"
            aria-label="delete budget"
            sx={{
              minHeight: "25px",
              height: "25px",
              width: "25px",
            }}
            onClick={handleDelete(budgetCat._id)}
            disabled={isLoading}
          >
            <DeleteIcon fontSize="10" />
          </Fab>
        </Grid>
      </Grid>
    </>
  );
}

export default BudgetCategoryListItem;
