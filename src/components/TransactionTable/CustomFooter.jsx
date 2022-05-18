import React from "react";
import { Paper, Grid } from "@mui/material";
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";

function CustomFooter({ count }) {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  return (
    <Paper sx={{ px: 5, py: 2 }}>
      <Grid container>
        <Grid item xs={12} md={2}>
          Total:{count}
        </Grid>
        <Grid item xs={12} md={10} alignContent={"flex-end"}>
          <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CustomFooter;
