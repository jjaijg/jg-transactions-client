import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
// import { randomHexColorWithArray } from "random-hex-color-generator";
import { fullMonths } from "../../constants/months";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  aspectRation: 1,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    // title: {
    //   display: true,
    //   text: "Last 6 month comparison",
    // },
  },
};

const getChartData = (txns = []) => {
  const incomeData = {};
  const expenseData = {};
  let labels = [];
  txns.forEach((txn) => {
    const month = fullMonths[parseInt(txn._id.split("-")[0], 10) - 1];
    incomeData[month] = txn.income;
    expenseData[month] = txn.expense;
  });
  labels = Object.keys(incomeData);
  return {
    labels,
    datasets: [
      {
        label: "Income",
        data: Object.values(incomeData),
        backgroundColor: "#98FB98",
      },
      {
        label: "Expense",
        data: Object.values(expenseData),
        backgroundColor: "#FF6347",
      },
    ],
  };
};
function MonthChart({ transactions = [] }) {
  return (
    <Paper elevation={3} sx={{ py: 2, my: 2, minHeight: 280 }}>
      <Typography variant="h6" textAlign={"center"}>
        Last 6 month comparison
      </Typography>
      <Bar
        width={"70%"}
        height={"41vh"}
        options={options}
        data={getChartData(transactions)}
      />
    </Paper>
  );
}

export default MonthChart;
