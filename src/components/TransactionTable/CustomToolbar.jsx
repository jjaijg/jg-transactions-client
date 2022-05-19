import { useContext } from "react";
import {
  GridToolbarContainer,
  // GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import { DownloadForOffline } from "@mui/icons-material";
import {
  TransactionCtx,
  TransactionDispatchCtx,
} from "../../context/transactionContext";
import { CircularProgress } from "@mui/material";

function CustomToolbar() {
  const { isDowloading } = useContext(TransactionCtx);
  const { downloadTxns } = useContext(TransactionDispatchCtx);

  const exportToExcel = () => {
    downloadTxns();
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport /> */}
      <Button
        startIcon={
          isDowloading ? <CircularProgress size={20} /> : <DownloadForOffline />
        }
        onClick={exportToExcel}
      >
        Export
      </Button>
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
