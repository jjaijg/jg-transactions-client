import React from "react";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Skeleton,
  Badge,
} from "@mui/material";
import { fullMonths } from "../../constants/months";
import { getMonth } from "date-fns";

function TransactionCard({ txnTotal, selectedDate }) {
  const { income, expense, incomeCount, expenseCount } = txnTotal;
  return (
    <Card sx={{ my: 2 }}>
      <CardHeader
        title={`${fullMonths[getMonth(selectedDate)]} transactions`}
        sx={{ textAlign: "center" }}
      />
      <CardContent>
        <Stack sx={{ textAlign: "center" }} gap={2}>
          <Typography variant="h6">
            <Badge badgeContent={incomeCount} color="success">
              {"Income"}
            </Badge>
          </Typography>
          <Typography variant="h5">
            {income ? (
              <CountUp end={income} prefix="₹ " decimals={2} duration={1} />
            ) : (
              <Skeleton width={"80%"} sx={{ mx: "auto" }} />
            )}
          </Typography>
          <Typography variant="h6">
            <Badge badgeContent={expenseCount} color="error">Expense</Badge>
          </Typography>
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
