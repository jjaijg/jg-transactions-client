import {
  GridToolbarContainer,
  // GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import { DownloadForOffline } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

function CustomToolbar({isDowloading, downloadTxns}) {

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
