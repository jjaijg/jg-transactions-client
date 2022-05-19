import { useState, useEffect, useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

import TransactionCard from "../components/TransactionCard";
import RecentTransactionCard from "../components/RecentTransactionCard";
import AddTransaction from "../components/AddTransaction";
import TransactionTable from "../components/TransactionTable";
import { CategoryChart, MonthChart } from "../components/Charts";
import EditTransaction from "./../components/EditTransaction";

import {
  getTotalFromTransactions,
  // getfilteredTransactions,
  updateTransaction,
  deleteTransaction,
} from "../features/transactions/transactionsService";
import {
  createTransaction,
  reset,
} from "./../features/transactions/transactionsSlice";
import {
  TransactionCtx,
  TransactionDispatchCtx,
} from "../context/transactionContext";
import { getTransactions } from "../utils/transactionUtils";

const getTotal = async (token, params = {}) => {
  const res = await getTotalFromTransactions(token, params);
  const { transactions } = await res.data;
  return transactions;
};

function TransactionDashboard() {
  // REDUX
  const dispatch = useDispatch();
  // CONTEXT
  const {
    transactions,
    user,
    page,
    pageSize,
    currentDateFilter,
    totalCount,
    loading,
    refresh,
  } = useContext(TransactionCtx);
  const {
    setCurrentDateFilter,
    setTxnFilter,
    setTxnSort,
    setPage,
    setPageSize,
    setLoading,
    setRefresh,
    // getFilteredTxns,
  } = useContext(TransactionDispatchCtx);
  // GLOBAL STATES
  // const { user } = useSelector((state) => state.auth);
  const { isSuccess, isError, message, isLoading } = useSelector(
    (state) => state.transactions
  );

  // TRANSACTION CARD STATES
  const [txnDetail, setTxnDetail] = useState({
    income: 0,
    expense: 0,
  });

  // RECENT TRANSACTIONS CARD STATES
  const [recents, setRecents] = useState([]);

  // LAST 6 MONTH CHART STATES
  const [sixMonthTxns, setSixMonthTxns] = useState([]);

  // CATEGORY CHART STATES
  const [totalByCat, setTotalByCat] = useState([]);

  // ADD TRANSACTION DIALOG STATES
  const [openAdd, setOpenAdd] = useState(false);

  // EDIT TRANSACTION DIALOG STATES
  const [txnEdit, setTxnEdit] = useState({});
  const [openEdit, setOpenEdit] = useState(false);

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

  const handleEditTransaction = async (transaction) => {
    setLoading(true);
    await updateTransaction(user?.token, transaction)
      .then(() => {
        setRefresh(true);
      })
      .catch(() => {
        setRefresh(false);
        setLoading(false);
      });
  };

  // TRANSACTION TABLE FUNCTIONS
  const handleEdit = async (row) => {
    console.log("editing : ", row);
    setTxnEdit(row);
    handleEditOpen();
  };
  const handleDelete = async (id) => {
    const canDel = window.confirm(
      "Are you sure?  Do you want to delete the selected transaction? "
    );
    if (!canDel) return;
    setLoading(true);
    await deleteTransaction(user?.token, id)
      .then(() => {
        setRefresh(true);
      })
      .catch(() => {
        setRefresh(false);
        setLoading(false);
      });
  };

  const handleFilterChange = useCallback(
    (model, details) => {
      console.log("Filtering : ", model);
      const { columnField, operatorValue, value } = model.items[0];
      if (value === undefined) return setTxnFilter({});
      setTxnFilter({
        [columnField]: value,
        op: operatorValue,
      });
    },
    [setTxnFilter]
  );

  const handleSortChange = useCallback(
    (model, details) => {
      console.log("Sorting : ", model);
      if (model?.length <= 0) return setTxnSort({});
      const { field, sort } = model[0];
      setTxnSort({
        sort_by: field,
        sort_order: sort,
      });
    },
    [setTxnSort]
  );

  // TRANSACTION CARD FUNCTIONS
  const getTxnTotals = (user, currentDateFilter) => {
    if (user && user.token && currentDateFilter) {
      const start = startOfMonth(currentDateFilter);
      const end = endOfMonth(currentDateFilter);
      getTotal(user.token, {
        // group: "month",
        start,
        end,
        limit: 12000,
      }).then((transactions) => {
        console.log("transactions totla :", transactions);
        if (transactions.length) {
          setTxnDetail({
            [transactions[0]._id]: transactions[0].totalAmount,
            [transactions[1]._id]: transactions[1].totalAmount,
          });
        } else {
          setTxnDetail({ expense: 0, income: 0 });
        }
      });
    }
  };

  // RECENT TRANSACTIONS FUNCTIONS
  const getRecentTxns = useCallback((user) => {
    if (user?.token) {
      // setLoading(true);
      getTransactions(user.token, {
        limit: 5,
      })
        .then((res) => {
          const { transactions } = res.data;
          setRecents(transactions);
        })
        .catch((err) => {
          console.log("error in getting recent transactions : ", err);
        });
    }
  }, []);

  // LAST 6 MONTH CHART FUNCTION
  const getTotalForSixMonths = (user, date) => {
    if (user?.token) {
      const start = startOfMonth(subMonths(date, 6));
      const end = new Date();
      getTotal(user.token, {
        group: "month",
        limit: 12000,
        start,
        end,
        sort_order: "asc",
        sort_by: "_id",
      }).then((txns) => {
        setSixMonthTxns(txns);
      });
    }
  };

  // CATEGORY CHART FUNCTION
  const getTotalByCategory = (user, date) => {
    if (user?.token) {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      getTotal(user.token, {
        group: "category",
        limit: 12000,
        start,
        end,
      }).then((txns) => {
        setTotalByCat(txns);
      });
    }
  };

  // TRANSACTION ADD EFFECTS
  useEffect(() => {
    if (isError && message) {
      console.log(message);
      toast.error(Array.isArray(message) ? message.join("\n") : message);
      dispatch(reset());
    }

    if (isSuccess && message) {
      toast.success(message);
      setRefresh(true);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, setRefresh, dispatch]);

  // DASHBOARD, TRANSACTION CARD, LAST 6 MONTH CHART EFFECTS
  useEffect(() => {
    getTxnTotals(user, currentDateFilter);
    getTotalByCategory(user, currentDateFilter);
    getTotalForSixMonths(user, currentDateFilter);
  }, [currentDateFilter, user]);

  // COMMON EFFECTS
  useEffect(() => {
    if (refresh) {
      // getFilteredTxns(user, page, pageSize, currentDateFilter);
      getTotalByCategory(user, currentDateFilter);
      getTotalForSixMonths(user, currentDateFilter);
      getTxnTotals(user, currentDateFilter);
      getRecentTxns(user);
    }
  }, [refresh, user, currentDateFilter, page, pageSize, getRecentTxns]);

  // RECENT TRANSACTIONS EFFECT
  useEffect(() => {
    getRecentTxns(user);
  }, [user, getRecentTxns]);

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
                value={currentDateFilter}
                minDate={new Date("2021-01-01")}
                maxDate={new Date("2024-01-01")}
                views={["month", "year"]}
                onChange={(newValue) => {
                  setCurrentDateFilter(newValue);
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
              income={txnDetail.income}
              expense={txnDetail.expense}
              selectedDate={currentDateFilter}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentTransactionCard transactions={recents} />
          </Grid>
          <Grid item xs={12} md={4}>
            <MonthChart transactions={sixMonthTxns} />
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <CategoryChart
            transactions={totalByCat}
            type="income"
            title="Income by category"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CategoryChart
            transactions={totalByCat}
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
          pagSize={pageSize}
          rowCount={totalCount}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          setPage={setPage}
          setPageSize={setPageSize}
          loading={loading}
          handleFilterChange={handleFilterChange}
          handleSortChange={handleSortChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Paper>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <AddTransaction
          addTransaction={handleAddTransaction}
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
        transaction={txnEdit}
        editTransaction={handleEditTransaction}
        open={openEdit}
        loading={loading}
        handleClose={() => {
          setOpenEdit(false);
        }}
      />
    </Container>
  );
}

export default TransactionDashboard;
