import { useEffect, useCallback } from "react";
import {
  Container,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Box,
} from "@mui/material";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { useFormik } from "formik";
import * as yup from "yup";
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

function EditTransaction({
  transaction,
  categories,
  budgets,
  open,
  loading,
  handleClose,
  editTransaction,
}) {
  // const { user } = useSelector((state) => state.auth);
  // const { categories } = useSelector((state) => state.categories);

  const formik = useFormik({
    initialValues: {
      amount: 1,
      type: "income",
      category: null,
      budgets: [],
      description: "",
      date: new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("prev txn : ", transaction);
      console.log("curr txn : ", values);
      // alert(
      //   JSON.stringify({ ...values, date: values.date.toLocaleDateString() })
      // );
      editTransaction({
        prevTxn: {
          ...transaction,
          // budgets: transaction.budgets.map((bud) => bud._id) || [],
        },
        curTxn: {
          ...values,
          date: values.date.toLocaleDateString(),
          category: values.category._id,
          id: transaction._id,
          budgets: values.budgets.map((bud) => bud._id) || [],
        },
      });
    },
  });

  const setInitialFormData = useCallback((transaction) => {
    console.log("setting formik values for transaction... : ", transaction);
    formik.setValues({
      amount: transaction?.amount || 1,
      type: transaction?.type || "income",
      category: {
        name: transaction?.category_name,
        _id: transaction?.category,
      },
      budgets: transaction?.budgets ?
        transaction.budgets.map((bud) => budgets.filter((b) => b._id === bud)[0]) : [],
      description: transaction?.description || "",
      date: transaction?.date ? new Date(transaction?.date) : new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  useEffect(() => {
    if (transaction && Object.keys(transaction).length > 0) {
      setInitialFormData(transaction);
    }
  }, [transaction, setInitialFormData]);

  return (
    <Container>
      <Dialog scroll="paper" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Edit Transaction</DialogTitle>
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
              <Stack spacing={2} direction="row" alignItems={"center"}>
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
                  sx={{ width: "50%", mr: 1 }}
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
                <Box sx={{ pt: 0.5, width: "50%" }}>
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
                        <TextField {...params} variant="standard" fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              </Stack>
              <Stack spacing={2} direction={"row"} alignItems="center">
                <Autocomplete
                  disablePortal
                  id="category"
                  name="category"
                  placeholder="Select category"
                  openOnFocus
                  options={categories || []}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(opt, val) => opt?._id === val?._id}
                  value={formik.values.category}
                  onChange={(e, val) => {
                    formik.setFieldValue("category", val);
                  }}
                  size={"small"}
                  sx={{ minWidth: "48%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="standard"
                      required
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                      helperText={
                        formik.touched.category && formik.errors.category
                      }
                    />
                  )}
                />
                <Autocomplete
                  disablePortal
                  id="budgets"
                  name="budgets"
                  placeholder="Select budgets to link"
                  multiple
                  openOnFocus
                  options={budgets || []}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  value={formik.values.budgets}
                  onChange={(e, val) => {
                    formik.setFieldValue("budgets", val);
                  }}
                  size={"small"}
                  sx={{ minWidth: "48%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Link to budgets"
                      variant="standard"
                    />
                  )}
                />
              </Stack>

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
                <Button
                  onClick={handleClose}
                  disabled={loading}
                  color="error"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={25} /> : "Update"}
                </Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default EditTransaction;
