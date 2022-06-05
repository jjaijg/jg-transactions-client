import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Container, Grid, Stack, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { toast } from "react-toastify";

import BudgetFilterNav from "../components/budgetComponents/BudgetFilterNav";
import BudgetDetailCard from "../components/budgetComponents/BudgetDetailCard";
import BudgetOverallDetail from "../components/budgetComponents/BudgetOverallDetail";
import BudgetCategoryList from "../components/budgetComponents/BudgetCategoryList";
import BudgetAddModal from "../components/budgetComponents/BudgetAddModal";
import BudgetEditModal from "../components/budgetComponents/BudgetEditModal";

import {
  setBudgetIdSearch,
  setSelectedBudget,
  getFilteredBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  createBudgetCat,
  updateBudgetCatAmt,
  deleteBudgetCat,
  refetchBudgets,
  resetMessage,
} from "../features/budgets/budgetsSlice";

function BudgetBoard() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);
  const {
    budgetIdSearch,
    selectedBudget,
    budgets,
    isLoading,
    isRefetch,
    isCreating,
    isUpdating,
    isDeleting,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.budgets);

  // const [selectedBudget, setSelectedBudget] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    if (user?.token) {
      console.log("budget search key : ", budgetIdSearch)
      dispatch(getFilteredBudgets({ budgetId: budgetIdSearch, limit: 1000 }));
      // dispatch(getUserCategories());
    }
  }, [user, budgetIdSearch, dispatch]);

  useEffect(() => {
    if (isRefetch)
      dispatch(
        getFilteredBudgets({
          budgetId: budgetIdSearch,
          limit: 1000,
          isClearCache: true,
        })
      );
  }, [isRefetch, budgetIdSearch, dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(resetMessage());
    }
    if (isError && message) {
      let err = message;
      if (Array.isArray(message)) err = message.join(",");
      console.log("error message :", err);

      toast.error(err);
      dispatch(resetMessage());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleBudgetSearch = (key) => dispatch(setBudgetIdSearch(key));

  const handleRefetch =
    (fetch = false) =>
    () =>
      dispatch(refetchBudgets(fetch));

  const handleBudgetSelect = (budget) => () => {
    dispatch(setSelectedBudget(budget));
  };

  const handleAddBudgetOpen = () => {
    setAddModal(true);
  };

  const handleAddBudget = (newBudget) => {
    dispatch(createBudget(newBudget));
  };

  const handleEditBudgetOpen = () => {
    if (selectedBudget) setEditModal(true);
  };

  const handleUpdateBudget = (updBudget) => {
    dispatch(updateBudget(updBudget));
  };

  const handleDeleteBudget = (id) => {
    dispatch(deleteBudget(id));
  };

  const handleAddBudgetCat = (newBudgetCat) => {
    dispatch(createBudgetCat({ ...newBudgetCat, budget: selectedBudget._id }));
  };

  const handleUpdateBudgetCat = (updBudgetCat) => {
    console.log("can we upd cat : ", updBudgetCat);
    dispatch(updateBudgetCatAmt(updBudgetCat));
  };

  const handleDeleteBudgetCat = (id) => {
    dispatch(deleteBudgetCat(id));
  };

  return (
    <Container maxWidth="lg" sx={{ my: 1, flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <BudgetFilterNav
            budgets={budgets}
            searchKey={budgetIdSearch}
            selectedBudget={selectedBudget}
            handleBudgetSelect={handleBudgetSelect}
            handleSearch={handleBudgetSearch}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={9}>
          <Box
            // elevation={1}
            sx={{
              height: `calc(100vh - 80px)`,
              py: 1,
              px: 2,
              overflowX: "hidden",
            }}
          >
            <Stack
              spacing={2}
              direction={"row"}
              alignItems={"center"}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              <Typography textAlign={"center"} variant="h5">
                Budget Board
              </Typography>
              <Fab
                variant="extended"
                color="primary"
                size="small"
                aria-label="add budget category"
                sx={{
                  minHeight: "25px",
                  height: "25px",
                }}
                onClick={handleRefetch(true)}
              >
                <AutorenewIcon fontSize="10" sx={{ mr: 1 }} />
                Refresh
              </Fab>
            </Stack>
            {selectedBudget && (
              <Grid container sx={{ py: 1 }} spacing={2}>
                <Grid item xs={6}>
                  <BudgetDetailCard
                    selectedBudget={selectedBudget}
                    handleEditBudgetOpen={handleEditBudgetOpen}
                    handleDeleteBudget={handleDeleteBudget}
                  />
                </Grid>
                <Grid item xs={6} minHeight={"300px"}>
                  <BudgetOverallDetail selectedBudget={selectedBudget} />
                </Grid>
                <Grid item xs={12}>
                  <BudgetCategoryList
                    budgetCategories={selectedBudget.budgetCategories}
                    categories={categories}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    handleAddBudgetCat={handleAddBudgetCat}
                    handleUpdBudgetCat={handleUpdateBudgetCat}
                    handleDeleteBudgetCat={handleDeleteBudgetCat}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <BudgetAddModal
          user={user}
          categories={categories}
          open={addModal}
          loading={isCreating}
          addBudget={handleAddBudget}
          handleClose={() => setAddModal(false)}
        />
        <Fab
          color="primary"
          size="medium"
          aria-label="add budget"
          onClick={handleAddBudgetOpen}
        >
          <AddIcon />
        </Fab>
      </Box>
      <BudgetEditModal
        user={user}
        budget={selectedBudget}
        open={editModal}
        loading={isUpdating}
        updateBudget={handleUpdateBudget}
        handleClose={() => setEditModal(false)}
      />
    </Container>
  );
}

export default BudgetBoard;
