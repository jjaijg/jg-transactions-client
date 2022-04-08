import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Container, Grid, Typography } from "@mui/material";
import TransactionCard from "../components/TransactionCard";
import RecentTransactionCard from "../components/RecentTransactionCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddTransaction from "../components/AddTransaction";
import TransactionTable from "../components/TransactionTable";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

import {
  getTotalFromTransactions,
  getfilteredTransactions,
  deleteTransaction,
} from "../features/transactions/transactionsService";
import {
  createTransaction,
  reset,
} from "./../features/transactions/transactionsSlice";
import { toast } from "react-toastify";
import { CategoryChart, MonthChart } from "../components/Charts";

const getTransactions = async (token, params = { page: 1, group: 0 }) => {
  const paramters = {
    ...params,
  };
  return await getfilteredTransactions(token, paramters);
};

const getTotal = async (token, params = {}) => {
  const res = await getTotalFromTransactions(token, params);
  const { transactions } = await res.data;
  return transactions;
};

function TransactionDashboard() {
  // REDUX
  const dispatch = useDispatch();
  // GLOBAL STATES
  const { user } = useSelector((state) => state.auth);
  const { isSuccess, isError, message } = useSelector(
    (state) => state.transactions
  );

  // Dashboard STATES
  const [currentDateFilter, setCurrentDateFilter] = useState(new Date());

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

  // TRANSACTION TABLE STATES
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // ADD TRANSACTION DIALOG FUNCTIONS
  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddTransaction = (transaction) => {
    dispatch(createTransaction(transaction));
  };

  // TRANSACTION TABLE FUNCTIONS
  const handleDelete = async (id) => {
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

  // TRANSACTION TABLE FUNCTIONS
  const getFilteredTxns = (user, page, pageSize, txnGrpDate) => {
    if (user && user.token && pageSize) {
      setLoading(true);
      getTransactions(user.token, {
        limit: pageSize,
        page,
        start: startOfMonth(txnGrpDate),
        end: endOfMonth(txnGrpDate),
      })
        .then((res) => {
          const {
            transactions,
            totalResults,
            // page,
            // limit,
            // totalPages,
            // hasNextPage,
            // hasPrevPage,
            // nextPage,
            // prevPage,
          } = res.data;
          // console.log(res.data);
          setRefresh(false);
          setTransactions(transactions);
          setTotalCount(totalResults);
          setLoading(false);
        })
        .catch((err) => {
          console.log("error in trsanctions : ", err);
          setLoading(false);
        });
    }
  };

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
  const getRecentTxns = (user) => {
    if (user) {
      setLoading(true);
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
  };

  // LAST 6 MONTH CHART FUNCTION
  const getTotalForSixMonths = (user, date) => {
    if (user) {
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
    if (user) {
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

  // TRANSACTION TABLE EFFECTS
  useEffect(() => {
    getFilteredTxns(user, page, pageSize, currentDateFilter);
  }, [user, page, pageSize, currentDateFilter]);

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
  }, [isSuccess, isError, message, dispatch]);

  // DASHBOARD, TRANSACTION CARD, LAST 6 MONTH CHART EFFECTS
  useEffect(() => {
    getTxnTotals(user, currentDateFilter);
    getTotalByCategory(user, currentDateFilter);
    getTotalForSixMonths(user, currentDateFilter);
  }, [currentDateFilter, user]);

  // COMMON EFFECTS
  useEffect(() => {
    if (refresh) {
      getFilteredTxns(user, page, pageSize, currentDateFilter);
      getTotalByCategory(user, currentDateFilter);
      getTotalForSixMonths(user, currentDateFilter);
      getTxnTotals(user, currentDateFilter);
      getRecentTxns(user);
    }
  }, [refresh, user, currentDateFilter, page, pageSize]);

  // RECENT TRANSACTIONS EFFECT
  useEffect(() => {
    getRecentTxns(user);
  }, [user]);

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
      <Box sx={{ height: 450, width: "100%", my: 2, mb: 8 }}>
        <TransactionTable
          transactions={transactions}
          pagSize={pageSize}
          rowCount={totalCount}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          setPage={setPage}
          setPageSize={setPageSize}
          loading={loading}
          handleDelete={handleDelete}
        />
      </Box>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <AddTransaction
          addTransaction={handleAddTransaction}
          open={openAdd}
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
    </Container>
  );
}

export default TransactionDashboard;
