import React from "react";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import { fullMonths } from "../constants/months";
import { getMonth } from "date-fns";

function TransactionCard({ income, expense, selectedDate }) {
  return (
    <Card sx={{ my: 2 }}>
      <CardHeader
        title={`${fullMonths[getMonth(selectedDate)]} transactions`}
        sx={{ textAlign: "center" }}
      />
      <CardContent>
        <Stack sx={{ textAlign: "center" }} gap={2}>
          <Typography variant="h5">{"Income"}</Typography>
          <Typography variant="h5">
            {income ? (
              <CountUp end={income} prefix="₹ " decimals={2} duration={1} />
            ) : (
              <Skeleton width={"80%"} sx={{ mx: "auto" }} />
            )}
          </Typography>
          <Typography variant="h5">Expense</Typography>
          <Typography variant="h5">
            {expense ? (
              <CountUp end={expense} prefix="₹ " decimals={2} duration={1} />
            ) : (
              <Skeleton width={"80%"} sx={{ mx: "auto" }} />
            )}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TransactionCard;
