import React from "react";
import {
  Box,
  List,
  ListItemButton,
  Stack,
  Paper,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

function BudgetFilterNav({
  budgets,
  searchKey,
  selectedBudget,
  handleBudgetSelect,
  handleSearch,
  loading,
}) {
  const handleSearchChange = (e) => handleSearch(e.target.value);
  const handleClearSearch = () => handleSearch("");

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          height: `calc(100vh - 80px)`,
          overflowX: "hidden",
          px: 2,
          py: 1,
        }}
      >
        <Stack spacing={1}>
          <Typography textAlign={"left"} variant="h6" gutterBottom>
            Budget Filter
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search budget id..."
            InputProps={{
              endAdornment: searchKey && (
                <IconButton
                  size={"small"}
                  onClick={handleClearSearch}
                  sx={{ mr: -1 }}
                >
                  <ClearIcon fontSize="10" />
                </IconButton>
              ),
            }}
            onChange={handleSearchChange}
          />
          {loading && (
            <Box sx={{display: "flex", justifyContent:"center", pt:5}}>
              <CircularProgress />
            </Box>
          )}
          <List
            aria-label="Budget lists"
            dense
            sx={{ maxHeight: "65vh", overflowY: "auto" }}
          >
            {budgets &&
              budgets?.map((budget) => (
                <ListItemButton
                  key={budget._id}
                  selected={budget._id === selectedBudget?._id}
                  onClick={handleBudgetSelect(budget)}
                >
                  <ListItemText primary={budget.budgetId} />
                </ListItemButton>
              ))}
          </List>
        </Stack>
      </Paper>
    </>
  );
}

export default React.memo(BudgetFilterNav);
