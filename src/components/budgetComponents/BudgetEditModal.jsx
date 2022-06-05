import { useEffect } from "react";
import {
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
// import { toast } from "react-toastify";

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Budget name is required")
    .min(3, "Budget name should be minimum 3 characters")
    .max(50, "Budget name should be less thaan 50 characters."),
  description: yup
    .string()
    .max(300, "description must be less than 300 characters."),
});

function BudgetEditModal({
  budget,
  user,
  handleClose,
  updateBudget,
  open = false,
  loading = false,
}) {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("update budget val : ", values);
      updateBudget({ ...values, id: budget._id });
    },
  });

  useEffect(() => {
    if (budget) {
      const { name, description } = budget;
      formik.setValues({ name, description });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget]);

  return (
    <Container>
      <Dialog scroll="paper" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Add Budget</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                label="Budget name"
                fullWidth
                variant="standard"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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

export default BudgetEditModal;
