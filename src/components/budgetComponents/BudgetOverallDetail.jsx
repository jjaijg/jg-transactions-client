import React from "react";
import { Grid, Paper, Typography, Chip, Badge } from "@mui/material";
import CountUp from "react-countup";

import { calcUsagePercent, usageFeedbackColor } from "../../utils/budgetUtils";

function BudgetOverallDetail({ selectedBudget }) {
  console.log("budgets : ", selectedBudget);
  const usedPercent = calcUsagePercent(
    selectedBudget.planned,
    selectedBudget.actual
  );

  const totalTransactions = (budgetCategories = []) => {
    const total = budgetCategories.reduce((total, cat) => {
      total += cat.transactions?.length || 0;
      // console.log("reduce total : ", total, JSON.stringify(cat));
      return total;
    }, 0);
    console.log("total : ", total);
    return total;
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography textAlign={"center"} variant="h6" gutterBottom>
          Budget Detail
        </Typography>
        <Grid
          alignContent={"space-around"}
          container
          spacing={1}
          sx={{ p: 2 }}
          height={"267px"}
        >
          <Grid item xs={6}>
            Overall planned
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
            <CountUp end={selectedBudget.planned} prefix="₹ " decimals={2} duration={1} />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            Overall actual
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              <CountUp end={selectedBudget.actual} prefix="₹ " decimals={2} duration={1} />
              </Typography>
          </Grid>
          <Grid item xs={6}>
            Usage
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`${usedPercent || ""}`}
              color={usageFeedbackColor(
                selectedBudget.planned,
                selectedBudget.actual
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Badge
              badgeContent={selectedBudget.budgetCategories.length}
              color="success"
            >
              <Chip
                label={` Categories `}
                color={"info"}
                size="small"
                variant="outlined"
              />
            </Badge>
          </Grid>
          <Grid item xs={12}>
            <Badge
              badgeContent={totalTransactions(selectedBudget.budgetCategories)}
              color="success"
            >
              <Chip
                label={` Transactions `}
                color={"info"}
                size="small"
                variant="outlined"
              />
            </Badge>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default BudgetOverallDetail;
