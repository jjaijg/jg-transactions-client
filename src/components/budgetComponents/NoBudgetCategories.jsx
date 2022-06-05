import React from "react";
import { Box, Typography } from "@mui/material";

function NoBudgetCategories() {
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent={"center"}
      pt={5}
    >
      <img
        height={"200px"}
        src={"/assets/images/no_data.svg"}
        alt={"no data"}
      />
      <Typography variant="h6" color="GrayText" textAlign={"center"}>
        No Data
      </Typography>
    </Box>
  );
}

export default NoBudgetCategories;
