import React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Fab,
  Tooltip,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { addElipsis } from "../../utils/budgetUtils";

function BudgetDetailCard({
  selectedBudget,
  handleEditBudgetOpen,
  handleDeleteBudget,
}) {
  const handleDelete = (id) => () => {
    console.log("deleted id : ", id);
    if (window.confirm("Budget will be deleted permanently, are you sure?"))
      handleDeleteBudget(id);
  };

  return (
    <>
      <Card sx={{ boxShadow: 3 }}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="140"
            image="/assets/images/money_bg.jpg"
            alt="Budget card background"
          />
          <Stack direction="row" justifyContent={"center"} spacing={1}>
            <Tooltip title={selectedBudget.name} placement="top">
              <Typography
                variant="h6"
                // component="div"
                textOverflow={"ellipsis"}
                textAlign={"center"}
                sx={{ fontWeight: 600 }}
              >
                {addElipsis(selectedBudget.name, 25)}
              </Typography>
            </Tooltip>
            <Fab
              size="small"
              color="info"
              aria-label="edit budget"
              sx={{
                minHeight: "25px",
                height: "25px",
                width: "25px",
              }}
              onClick={handleEditBudgetOpen}
            >
              <EditIcon fontSize="10" />
            </Fab>
            <Fab
              size="small"
              color="error"
              aria-label="delete budget"
              sx={{
                minHeight: "25px",
                height: "25px",
                width: "25px",
              }}
              onClick={handleDelete(selectedBudget._id)}
            >
              <DeleteIcon fontSize="10" />
            </Fab>
          </Stack>
          <Box display={"flex"} justifyContent={"center"}>
            <Chip
              label={selectedBudget.budgetId}
              color={"secondary"}
              sx={{ ml: 2 }}
              size="small"
            />
          </Box>
        </Box>
        <CardContent sx={{ height: "75px", mb: 1 }}>
          {addElipsis(selectedBudget.description, 80) || "No description..."}
        </CardContent>
        <CardActions sx={{ height: "35px" }}>
          {selectedBudget.budgetCategories.slice(0, 3).map((budCat) => (
            <Chip
              key={budCat._id}
              label={addElipsis(budCat.category_name, 12)}
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ fontSize: "10px" }}
            />
          ))}
          {selectedBudget.budgetCategories.length - 3 > 0 && (
            <Chip
              label={`+${addElipsis(
                (selectedBudget.budgetCategories.length - 3).toString(),
                10
              )}...`}
              size="small"
              variant="outlined"
              color="info"
              sx={{ fontSize: "10px" }}
            />
          )}
        </CardActions>
      </Card>
    </>
  );
}

export default BudgetDetailCard;
