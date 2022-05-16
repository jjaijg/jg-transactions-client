import { Skeleton, Box } from "@mui/material";
import React from "react";

function CategoryLoader() {
  return (
    <Box sx={{m:2}}>
      <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={15} width="50%" />
    </Box>
  );
}

export default CategoryLoader;
