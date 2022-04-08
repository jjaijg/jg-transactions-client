import { useState } from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CategoryIcon from "@mui/icons-material/Category";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";
import MobileDatePicker from "@mui/lab/MobileDatePicker";

function FilterBar({
  groupBy,
  setGroupBy,
  txnGrpDate,
  setTxnGrpDate,
  filterOpen,
  setFilterOpen,
}) {
  //   const [groupBy, setGroupBy] = useState("month");
  //   const [monthInput, setMonthInput] = useState(new Date());

  const handleChange = (e, isExpanded) => {
    console.log("filter expand : ", isExpanded);
    setFilterOpen(isExpanded);
  };

  const onGroupChange = (e) => {
    setGroupBy(e.target.value);
  };
  const views = groupBy === "month" ? ["month", "year"] : ["year"];
  return (
    <Box sx={{ ml: "auto", maxWidth: "400px" }}>
      <Accordion expanded={filterOpen} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<CategoryIcon />}
          aria-controls="transaction-table-content"
          id="transaction-table-header"
        >
          <Typography>Group By</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="Transaction-group-by-filter"
                name="groupBy"
                value={groupBy}
                onChange={onGroupChange}
              >
                <FormControlLabel
                  value="month"
                  control={<Radio />}
                  label="Month"
                />
                <FormControlLabel
                  value="year"
                  control={<Radio />}
                  label="Year"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <MobileDatePicker
                label="For mobile"
                views={views}
                minDate={new Date("2021-01-01")}
                maxDate={new Date("2023-12-12")}
                value={txnGrpDate}
                onChange={(newValue) => {
                  setTxnGrpDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default FilterBar;
