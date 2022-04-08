import { useState } from "react";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";
import FilterBar from "./FilterBar";

function FilterMenu({ groupBy, setGroupBy }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = !!anchorEl;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (group) => {
    setGroupBy(group);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="filter-button"
        aria-controls={open ? "filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<CategoryIcon />}
      >
        Group by
      </Button>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "filter-menu",
        }}
      >
        <MenuItem
          selected={groupBy === "month"}
          onClick={() => handleClose("month")}
        >
          Month
        </MenuItem>
        <MenuItem
          selected={groupBy === "year"}
          onClick={() => handleClose("year")}
        >
          Year
        </MenuItem>
      </Menu>
    </div>
  );
}

function CustomToolbar() {
// {
//   groupBy,
//   setGroupBy,
//   txnGrpDate,
//   setTxnGrpDate,
//   filterOpen,
//   setFilterOpen,
// }
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      {/* <FilterMenu groupBy={groupBy} setGroupBy={setGroupBy} /> */}
      {/* <FilterBar
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        txnGrpDate={txnGrpDate}
        setTxnGrpDate={setTxnGrpDate}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
      /> */}
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
