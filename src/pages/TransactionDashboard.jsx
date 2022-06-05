import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import exportFromJSON from "export-from-json";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

import { CategoryChart, MonthChart } from "../components/Charts";
import TransactionCard from "../components/transactionComponents/TransactionCard";
import RecentTransactionCard from "../components/transactionComponents/RecentTransactionCard";
import AddTransaction from "../components/transactionComponents/AddTransaction";
import EditTransaction from "./../components/transactionComponents/EditTransaction";
import TransactionTable from "../components/transactionComponents/TransactionTable";

import {
  getFilteredTxns,
  getRecentTransactions,
  getTransactionTotals,
  getLastSixMonthDetail,
  getCategoryTotalDetail,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  setTxnBoardDate,
  setTxnEdit,
  setFilters,
  setTxnSort,
  setPagination,
  resetMessage,
} from "./../features/transactions/transactionsSlice";
import { getFilteredBudgets } from "../features/budgets/budgetsSlice";
import { getTransactions } from "../utils/transactionUtils";

import { FILE_NAME, EXPORT_TYPE } from "../constants";

function TransactionDashboard() {
  const navigate = useNavigate();

  // REDUX
  const dispatch = useDispatch();

  // GLOBAL STATES
  const { user } = useSelector((state) => state.auth);
  const { budgets } = useSelector((state) => state.budgets);
  const { categories } = useSelector((state) => state.categories);
  const {
    txnBoardDate,
    transactions,
    txnEdit,
    recents,
    txnTotal,
    latSixMonthDetails,
    categoryTotalDetail,
    txnFilters,
    txnSort,
    txnPagination,
    totalCount,
    isSuccess,
    isError,
    message,
    isLoading,
    isRefetch
  } = useSelector((state) => state.transactions);

  // ADD TRANSACTION DIALOG STATES
  const [openAdd, setOpenAdd] = useState(false);

  // EDIT TRANSACTION DIALOG STATES
  const [openEdit, setOpenEdit] = useState(false);

  // DWONLOAD TXNS
  const [isDowloading, setIsDownloading] = useState(false);

  // ADD TRANSACTION DIALOG FUNCTIONS
  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddTransaction = (transaction) => {
    dispatch(createTransaction(transaction));
  };

  // EDIT TRANSACTION DIALOG FUNCTIONS
  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditTransaction = async (updTxn) => {
    dispatch(updateTransaction(updTxn));
  };

  // TRANSACTION TABLE FUNCTIONS
  const handleEdit = async (row) => {
    console.log("editing : ", row);
    dispatch(
      setTxnEdit(row)
    );
    handleEditOpen();
  };
  const handleDelete = async (id) => {
    const canDel = window.confirm(
      "Are you sure?  Do you want to delete the selected transaction? "
    );
    if (!canDel) return;
    dispatch(deleteTransaction(id))
  };

  const handleFilterChange = useCallback(
    (model, details) => {
      console.log("Filtering : ", model);
      const { columnField, operatorValue, value } = model.items[0];
      if (value === undefined) return dispatch(setFilters({}));
      dispatch(
        setFilters({
          [columnField]: value,
          op: operatorValue,
        })
      );
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (model, details) => {
      console.log("Sorting : ", model);
      if (model?.length <= 0) return dispatch(setTxnSort({}));
      const { field, sort } = model[0];
      dispatch(
        setTxnSort({
          sort_by: field,
          sort_order: sort,
        })
      );
    },
    [dispatch]
  );

  const handlePaginationChange = (pagination) => {
    dispatch(setPagination(pagination));
  };

  // Download Transactions:
    const downloadTxns = useCallback(() => {

      if (user && user.token) {
        console.log("Downlaoding transactions...")
        setIsDownloading(true);
        getTransactions(user.token, {
          limit: 1200,
          page: 1,
          start: startOfMonth(new Date(txnBoardDate)),
          end: endOfMonth(new Date(txnBoardDate)),
          ...txnFilters,
          ...txnSort,
        })
          .then((res) => {
            let { transactions } = res.data;
            transactions = transactions.map((txn) => ({
              amount: txn.amount,
              type: txn.type,
              category_name: txn.category_name,
              date: format(new Date(txn.date), "dd/MMM/yyyy"),
              description: txn.description,
            }));
            exportFromJSON({
              data: transactions,
              fileName: FILE_NAME,
              exportType: EXPORT_TYPE,
              fields: {
                amount: "Amount",
                type: "Type",
                category_name: "Category",
                date: "Date",
                description: "Description",
              },
            });
            setIsDownloading(false);
          })
          .catch((err) => {
            console.log("error in downloading transactions : ", err);
            setIsDownloading(false);
          });
      }
    }, [user, txnBoardDate, txnFilters, txnSort]);

  // TRANSACTION ADD EFFECTS
  useEffect(() => {
    if (user?.token) {
      dispatch(getFilteredBudgets({ limit: 1000 }));
      // dispatch(getUserCategories());
    }
  }, [user?.token, dispatch]);

  useEffect(() => {
    if (isError && message) {
      console.log(message);
      toast.error(Array.isArray(message) ? message.join("\n") : message);
      dispatch(resetMessage());
    }

    if (isSuccess && message) {
      toast.success(message);
      dispatch(resetMessage());
    }
  }, [isSuccess, isError, message, dispatch]);

  // DASHBOARD, TRANSACTION CARD, LAST 6 MONTH CHART EFFECTS
  useEffect(() => {
    if (user && user.token) {
      const start = startOfMonth(new Date(txnBoardDate) || new Date()).toISOString();
      const end = endOfMonth(new Date(txnBoardDate) || new Date()).toISOString();

      const six_start = startOfMonth(
        subMonths(new Date(txnBoardDate) || new Date(), 6)
      ).toISOString();
      const six_end = new Date().toISOString();

      dispatch(
        getTransactionTotals({
          // group: "month",
          start,
          end,
          limit: 12000,
        })
      );

      dispatch(
        getCategoryTotalDetail({
          group: "category",
          limit: 12000,
          start,
          end,
        })
      );

      dispatch(
        getLastSixMonthDetail({
          group: "month",
          limit: 12000,
          start: six_start,
          end: six_end,
          sort_order: "asc",
          sort_by: "_id",
        })
      );
    }
  }, [txnBoardDate, user, dispatch]);

  // COMMON EFFECTS
  useEffect(() => {
    if (isRefetch && user && user.token) {
      const start = startOfMonth(
        new Date(txnBoardDate) || new Date()
      ).toISOString();
      const end = endOfMonth(
        new Date(txnBoardDate) || new Date()
      ).toISOString();
      const six_start = startOfMonth(
        subMonths(new Date(txnBoardDate) || new Date(), 6)
      ).toISOString();
      const six_end = new Date().toISOString();

      dispatch(
        getTransactionTotals({
          // group: "month",
          start,
          end,
          limit: 12000,
        })
      );

      dispatch(
        getCategoryTotalDetail({
          group: "category",
          limit: 12000,
          start,
          end,
        })
      );

      dispatch(
        getLastSixMonthDetail({
          group: "month",
          limit: 12000,
          start: six_start,
          end: six_end,
          sort_order: "asc",
          sort_by: "_id",
        })
      );
      dispatch(getRecentTransactions());
    }
  }, [isRefetch, user, txnBoardDate, txnPagination, dispatch]);

  // RECENT TRANSACTIONS EFFECT
  useEffect(() => {
    if (user?.token) dispatch(getRecentTransactions());
  }, [user, dispatch]);

  // TRANSACTION  EFFECTS
  useEffect(() => {
    if (user && user.token) dispatch(getFilteredTxns());
  }, [user, txnPagination, txnBoardDate, txnFilters, txnSort, dispatch]);

  useEffect(() => {
    if (user && user?.token && isRefetch) dispatch(getFilteredTxns());
  }, [user,isRefetch, dispatch]);

  // CHECK LOGIN STATUS
    useEffect(() => {
      if (!user) navigate("/login");
    }, [user, navigate]);

  return (
    <Container maxWidth="lg" sx={{ my: 1 }}>
      <Box sx={{ mt: 5 }}>
        {/* <Paper elevation={3}> */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Typography variant="h4" gutterBottom component="h5" align="center">
              Transaction dashboard
            </Typography>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={new Date(txnBoardDate)}
                minDate={new Date("2021-01-01")}
                maxDate={new Date("2024-01-01")}
                views={["month", "year"]}
                onChange={(newValue) => {
                  dispatch(setTxnBoardDate(new Date(newValue).toISOString()));
                }}
                renderInput={(params) => (
                  <TextField variant="outlined" size="small" {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TransactionCard
              txnTotal={txnTotal}
              selectedDate={new Date(txnBoardDate)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentTransactionCard transactions={recents} />
          </Grid>
          <Grid item xs={12} md={4}>
            <MonthChart transactions={latSixMonthDetails} />
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <CategoryChart
            transactions={categoryTotalDetail}
            type="income"
            title="Income by category"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CategoryChart
            transactions={categoryTotalDetail}
            type="expense"
            title="Expense by category"
          />
        </Grid>
      </Grid>
      <Paper
        elevation={3}
        sx={{ height: 450, width: "100%", my: 2, mb: 8, pb: 7 }}
      >
        <h3 style={{ textAlign: "center", paddingTop: "0.8rem" }}>
          All Transactions{" "}
        </h3>
        <TransactionTable
          transactions={transactions}
          pagSize={txnPagination.pageSize}
          rowCount={totalCount}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          loading={isLoading}
          isDowloading={isDowloading}
          downloadTxns={downloadTxns}
          handleFilterChange={handleFilterChange}
          handlePaginationChange={handlePaginationChange}
          handleSortChange={handleSortChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Paper>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <AddTransaction
          user={user}
          addTransaction={handleAddTransaction}
          categories={categories}
          budgets={budgets}
          open={openAdd}
          loading={isLoading}
          handleClose={() => {
            setOpenAdd(false);
          }}
        />
        <Fab
          color="primary"
          size="medium"
          aria-label="add"
          onClick={handleAddOpen}
        >
          <AddIcon />
        </Fab>
      </Box>
      <EditTransaction
        user={user}
        categories={categories}
        transaction={txnEdit}
        budgets={budgets}
        editTransaction={handleEditTransaction}
        open={openEdit}
        loading={isLoading}
        handleClose={() => {
          setOpenEdit(false);
          dispatch(setTxnEdit(null));
        }}
      />
    </Container>
  );
}

export default TransactionDashboard;
