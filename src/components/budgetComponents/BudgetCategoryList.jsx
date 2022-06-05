import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Stack,
  Typography,
  Divider,
  Fab,
} from "@mui/material";
import BudgetCategoryListItem from "./BudgetCategoryListItem";
import NoBudgetCategories from "./NoBudgetCategories";

import AddIcon from "@mui/icons-material/Add";
import BudgetCatAddModal from "./BudgetCatAddModal";
import BudgetCatEditModal from "./BudgetCatEditModal";

function BudgetCategoryList({
  budgetCategories,
  categories,
  isCreating,
  isUpdating,
  isDeleting,
  handleAddBudgetCat,
  handleUpdBudgetCat,
  handleDeleteBudgetCat,
}) {
  const [addCatModal, setAddCatModal] = useState(false);
  const [editCatModal, setEditCatModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    if (selectedCat) setEditCatModal(true);
  }, [selectedCat]);

  const handleAddBudgetCatOpen = () => {
    setAddCatModal(true);
  };

  const handleEditBudgetCatOpen = (budget) => () => {
    setSelectedCat(budget);
  };
  const handleEditBudgetCatClose = () => {
    setSelectedCat(null);
    setEditCatModal(false);
  };

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <Paper sx={{ pb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mx: 2 }}>
        <Typography textAlign={"center"} variant="h6" sx={{ py: 1 }}>
          Budget Categories
        </Typography>
        <Fab
          size="small"
          color="secondary"
          aria-label="Add budget category"
          sx={{
            minHeight: "30px",
            height: "30px",
            width: "30px",
          }}
          onClick={handleAddBudgetCatOpen}
          disabled={isLoading}
        >
          <AddIcon />
        </Fab>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {/* Header */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography textAlign={"center"} variant="subtitle" component={"h5"}>
            Category
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography textAlign={"center"} variant="subtitle" component={"h5"}>
            Planned (₹)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography textAlign={"center"} variant="subtitle" component={"h5"}>
            Actual (₹)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography textAlign={"center"} variant="subtitle" component={"h5"}>
            Actions
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2 }} />

      {/* Body */}
      <Box sx={{ height: "350px", overflowY: "auto" }}>
        {budgetCategories &&
          [...budgetCategories]
            .sort((prev, next) => next.planned - prev.planned)
            .map((budgetCat) => (
              <BudgetCategoryListItem
                key={budgetCat._id}
                budgetCat={budgetCat}
                handleEditBudgetCatOpen={handleEditBudgetCatOpen}
                handleDeleteBudgetCat={handleDeleteBudgetCat}
                isLoading={isLoading}
              />
            ))}
        {(!budgetCategories || !budgetCategories?.length) && (
          <NoBudgetCategories />
        )}
      </Box>
      <Divider sx={{ mt: 2 }} />
      <BudgetCatAddModal
        categories={categories}
        loading={isCreating}
        open={addCatModal}
        addBudgetCat={handleAddBudgetCat}
        handleClose={() => setAddCatModal(false)}
      />
      <BudgetCatEditModal
        budgetCat={selectedCat}
        loading={isUpdating}
        open={editCatModal}
        updBudgetCatAmt={handleUpdBudgetCat}
        handleClose={handleEditBudgetCatClose}
      />
    </Paper>
  );
}

export default BudgetCategoryList;
