import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import { CircularProgress, InputAdornment, MenuItem } from "@mui/material";
import Stack from "@mui/material/Stack";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as yup from "yup";
import { getUserCategories } from "./../features/categories/categoriesSlice";
// import { createTransaction } from "./../features/transactions/transactionsSlice";
// import { toast } from "react-toastify";

const validationSchema = yup.object({
  amount: yup
    .number()
    .typeError(`Amount is required`)
    .positive(`Please enter a valid amount`)
    .required("Amount is required"),
  type: yup
    .mixed()
    .oneOf(["income", "expense"])
    .required("Transaction type is required"),
  // category: yup.object(`Category is required`).required(`Category is required`),
  date: yup.date().required("Date is required"),
});

function AddTransaction({ open, loading, handleClose, addTransaction }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);

  const formik = useFormik({
    initialValues: {
      amount: 1,
      type: "income",
      category: {
        name: "---Select a category---",
      },
      description: "",
      date: new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values.date.toLocaleDateString());
      // alert(
      //   JSON.stringify({ ...values, date: values.date.toLocaleDateString() })
      // );
      addTransaction({
        ...values,
        date: values.date.toLocaleDateString(),
        category: values.category._id,
      });
    },
  });

  useEffect(() => {
    if (user && user.token) dispatch(getUserCategories());
  }, [user, dispatch]);

  return (
    <Container>
      <Dialog scroll="body" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="amount"
                label="Transaction amount"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                fullWidth
                variant="standard"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Transaction date"
                  id="date"
                  minDate={new Date("2021-01-01")}
                  value={formik.values.date}
                  onChange={(val) => {
                    console.log("date is : ", val);
                    formik.setFieldValue("date", val);
                  }}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                />
              </LocalizationProvider>

              <TextField
                required
                margin="dense"
                select
                id="type"
                name="type"
                label="Transaction type"
                fullWidth
                variant="standard"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {[
                  { label: "Income", value: "income" },
                  { label: "Expense", value: "expense" },
                ]?.map((typ) => (
                  <MenuItem key={typ.value} value={typ.value}>
                    {typ.label}
                  </MenuItem>
                ))}
              </TextField>
              <Autocomplete
                disablePortal
                id="category"
                name="category"
                options={categories || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(opt, val) => opt._id === val._id}
                value={formik.values.category}
                onChange={(e, val) => {
                  formik.setFieldValue("category", val);
                }}
                size={"small"}
                sx={{ mx: 1, minWidth: 120 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    variant="standard"
                    required
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                    helperText={
                      formik.touched.category && formik.errors.category
                    }
                  />
                )}
              />

              <TextField
                margin="dense"
                multiline
                maxRows={2}
                id="description"
                label="Description"
                fullWidth
                variant="standard"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <CircularProgress /> : "Add"}
                </Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default AddTransaction;
