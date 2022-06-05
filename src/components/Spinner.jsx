import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Spinner() {
  return (
    <Box sx={{ display: "flex", height: "90vh", alignItems:"center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}

export default Spinner;
