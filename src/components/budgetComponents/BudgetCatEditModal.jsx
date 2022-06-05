import { useEffect } from "react";
import {
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  CircularProgress,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  //   category: yup.string().required("Budget category is required"),
  planned: yup
    .number()
    .required("Planned amount is required")
    .min(1, "planned amount must be greater than 0.")
    .max(10000000, "planned amount must be less than 10000000."),
});

function BudgetCatEditModal({
  budgetCat,
  handleClose,
  updBudgetCatAmt,
  open = false,
  loading = false,
}) {
  const formik = useFormik({
    initialValues: {
      name: "",
      planned: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Budget cat update data : ", values);
      if (values.planned === budgetCat.planned)
        return toast.info("No changes made!");
      updBudgetCatAmt({ amount: values.planned, id: budgetCat._id });
    },
  });

  useEffect(() => {
    if (budgetCat)
      formik.setValues({
        name: budgetCat.category_name,
        planned: budgetCat.planned,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetCat]);

  return (
    <Container>
      <Dialog scroll="paper" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Edit Budget category</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                margin="dense"
                name={`name`}
                label="Category"
                value={formik.values.name}
                disabled
              />
              <TextField
                margin="dense"
                name={`planned`}
                label="Planned amount"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                fullWidth
                variant="standard"
                value={formik.values.planned}
                onChange={formik.handleChange}
                error={formik.touched.planned && Boolean(formik.errors.planned)}
                helperText={formik.touched.planned && formik.errors.planned}
              />

              <DialogActions>
                <Button
                  onClick={handleClose}
                  disabled={loading}
                  color="error"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} color="success">
                  {loading ? <CircularProgress size={25} /> : "Update category"}
                </Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default BudgetCatEditModal;
