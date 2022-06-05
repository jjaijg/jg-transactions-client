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
  Autocomplete,
  Button,
} from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  //   category: yup.string().required("Budget category is required"),
  planned: yup
    .number()
    .min(1, "planned amount must be greater than 0.")
    .max(10000000, "planned amount must be less than 10000000."),
});

function BudgetCatAddModal({
  categories,
  handleClose,
  addBudgetCat,
  open = false,
  loading = false,
}) {
  // console.log("categories from board : ", categories);

  const formik = useFormik({
    initialValues: {
      category: {
        name: "",
      },
      planned: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Budget cat creation data : ", values);
      addBudgetCat(values);
    },
  });

  return (
    <Container>
      <Dialog scroll="paper" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Add Budget category</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <Autocomplete
                disablePortal
                id={`name`}
                placeholder="Select category"
                options={categories || []}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(opt, val) => opt._id === val._id}
                value={formik.values.category}
                onChange={(e, val) => {
                  console.log("cat change : ", e, val);
                  formik.setFieldValue("category", val);
                }}
                size={"small"}
                sx={{ mx: 1, minWidth: 120 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    variant="standard"
                    margin="dense"
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
                <Button onClick={handleClose} disabled={loading} color="error">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={25} /> : "Add category"}
                </Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default BudgetCatAddModal;
