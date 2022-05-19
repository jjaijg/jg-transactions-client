import { createContext, useCallback, useEffect, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useSelector } from "react-redux";
import { getTransactions } from "../utils/transactionUtils";
import exportFromJSON from "export-from-json";

const FILE_NAME = "transactions";
const EXPORT_TYPE = "csv";

// Create two context:
// TransactionCtx: to query the context state
// TransactionDispatchCtx: to mutate the context state
const TransactionCtx = createContext(undefined);
const TransactionDispatchCtx = createContext(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function TransactionProvider({ children }) {
  // Dashboard STATES
  const [currentDateFilter, setCurrentDateFilter] = useState(new Date());
  // TRANSACTION STATE
  const [txns, setTxns] = useState([]);
  const [txnFilter, setTxnFilter] = useState({});
  const [txnSort, setTxnSort] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDowloading, setIsDownloading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // REDUX STATE
  const { user } = useSelector((state) => state.auth);

  const getFilteredTxns = useCallback(
    (page, pageSize, txnGrpDate, txnFilters = {}, txnSort = {}) => {
      if (user && user.token && pageSize) {
        setLoading(true);
        getTransactions(user.token, {
          limit: pageSize,
          page,
          start: startOfMonth(txnGrpDate),
          end: endOfMonth(txnGrpDate),
          ...txnFilters,
          ...txnSort,
        })
          .then((res) => {
            const { transactions, totalResults } = res.data;
            console.log(res.data);
            setRefresh(false);
            setTxns(transactions);
            setTotalCount(totalResults);
            setLoading(false);
          })
          .catch((err) => {
            console.log("error in trsanctions : ", err);
            setLoading(false);
          });
      }
    },
    [user]
  );

  const downloadTxns = useCallback(() => {
    const txnGrpDate = currentDateFilter;
    const txnFilters = txnFilter || {};
    const txnSorts = txnSort || {};

    if (user && user.token) {
      setIsDownloading(true);
      getTransactions(user.token, {
        limit: 1200,
        page: 1,
        start: startOfMonth(txnGrpDate),
        end: endOfMonth(txnGrpDate),
        ...txnFilters,
        ...txnSorts,
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
          console.log(transactions);
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
          console.log("error in trsanctions : ", err);
          setIsDownloading(false);
        });
    }
  }, [user, currentDateFilter, txnFilter, txnSort]);

  // TRANSACTION  EFFECTS
  useEffect(() => {
    getFilteredTxns(page, pageSize, currentDateFilter, txnFilter, txnSort);
  }, [page, pageSize, currentDateFilter, txnFilter, txnSort, getFilteredTxns]);

  useEffect(() => {
    if (refresh) {
      getFilteredTxns(page, pageSize, currentDateFilter);
    }
  }, [refresh, currentDateFilter, page, pageSize, getFilteredTxns]);

  return (
    <TransactionCtx.Provider
      value={{
        transactions: txns,
        user,
        page,
        pageSize,
        currentDateFilter,
        totalCount,
        loading,
        refresh,
        isDowloading,
        // txnFilter,
        // txnSort,
      }}
    >
      <TransactionDispatchCtx.Provider
        value={{
          setCurrentDateFilter,
          setTxnFilter,
          setTxnSort,
          setPage,
          setPageSize,
          setLoading,
          setRefresh,
          getFilteredTxns,
          downloadTxns,
          // setTotalCount,
          // setTransactions: setTxns,
        }}
      >
        {children}
      </TransactionDispatchCtx.Provider>
    </TransactionCtx.Provider>
  );
}

export { TransactionProvider, TransactionCtx, TransactionDispatchCtx };
