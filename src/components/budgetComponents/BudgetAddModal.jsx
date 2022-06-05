import { Fragment } from "react";
import {
  Stack,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  CircularProgress,
  InputAdornment,
  TextField,
  Divider,
  Typography,
  Autocomplete,
  Fab,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const generateId = (categories) => {
  if (!categories || categories.length === 0) return `cat-1`;
  const lastId = categories[categories.length - 1].id.split("-")[1];
  return `cat-${parseInt(lastId, 10) + 1}`;
};

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

function BudgetAddModal({
  categories,
  handleClose,
  addBudget,
  open = false,
  loading = false,
}) {
  // console.log("categories from board : ", categories);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      categories: [
        // {
        //   id: "cat-1",
        //   name: "",
        //   category: "",
        //   planned: 1,
        // },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Budget creation data : ", values);
      const isCategoryNotSelected = values.categories.filter(
        (cat) => !cat.category
      );
      if (isCategoryNotSelected.length > 0)
        return toast.error("Category is not selected!");
      addBudget(values);
    },
  });

  const handlePlannedChange = (catId, amount) => {
    if (isNaN(amount) || amount < 0) amount = 0;

    const updatedCategories = formik.values.categories.map((cat) =>
      cat.id !== catId ? cat : { ...cat, planned: amount }
    );
    formik.setFieldValue("categories", updatedCategories);
  };

  const handleCategoryChange = (catId, category = {}) => {
    const { name = "", _id } = category || {};
    const { categories } = formik.values;

    if (_id) {
      const isCategoryExists = categories.filter((cat) => cat.category === _id);
      if (isCategoryExists.length) {
        return toast.error("Category is already selected!");
      }
    }

    const updatedCategories = categories.map((cat) =>
      cat.id !== catId ? cat : { ...cat, name, category: _id }
    );
    formik.setFieldValue("categories", updatedCategories);
  };

  const handleResetCategory = () => {
    const category = {
      id: generateId(),
      name: "",
      category: "",
      planned: 1,
    };
    formik.setFieldValue("categories", [category]);
  };

  const handleAddCategory = () => {
    let categories = formik.values.categories;
    const newId = generateId(categories);
    categories.push({
      id: newId,
      name: "",
      category: null,
      planned: 1,
    });
    formik.setFieldValue("categories", categories);
  };

  const handleDeleteCategory = (id) => () => {
    let categories = formik.values.categories.filter((cat) => cat.id !== id);

    formik.setFieldValue("categories", categories);
  };

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
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" spacing={2}>
                <Typography variant="p" component={"h4"}>
                  Add Budget category (*optional)
                </Typography>
                <Fab
                  color="success"
                  size="small"
                  aria-label="add budget category"
                  sx={{
                    minHeight: "25px",
                    height: "25px",
                    width: "25px",
                  }}
                  onClick={handleAddCategory}
                >
                  <AddIcon fontSize="10" />
                </Fab>
                <Fab
                  variant="extended"
                  color="primary"
                  size="small"
                  aria-label="add budget category"
                  sx={{
                    minHeight: "25px",
                    height: "25px",
                  }}
                  onClick={handleResetCategory}
                >
                  <AutorenewIcon fontSize="10" sx={{ mr: 1 }} />
                  Reset
                </Fab>
              </Stack>

              <Grid container spacing={2}>
                {formik.values.categories &&
                  formik.values.categories.map((cat) => (
                    <Fragment key={cat.id}>
                      <Grid item xs={5}>
                        <Autocomplete
                          disablePortal
                          id={`${cat.id}_name`}
                          options={categories || []}
                          placeholder="Select Category"
                          getOptionLabel={(option) => option?.name || ""}
                          isOptionEqualToValue={(opt, val) =>
                            opt._id === val.category
                          }
                          value={cat}
                          onChange={(e, val) => {
                            console.log("cat change : ", e, val);
                            handleCategoryChange(cat.id, val);
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
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          margin="dense"
                          id={`${cat.id}_planned`}
                          name={`${cat.id}_planned`}
                          label="Planned amount"
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                          variant="standard"
                          value={cat.planned}
                          onChange={(e) => {
                            handlePlannedChange(cat.id, e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={2} alignSelf="center">
                        <Fab
                          size="small"
                          color="error"
                          aria-label="delete budget"
                          sx={{
                            minHeight: "25px",
                            height: "25px",
                            width: "25px",
                          }}
                          onClick={handleDeleteCategory(cat.id)}
                        >
                          <DeleteIcon fontSize="10" />
                        </Fab>
                      </Grid>
                    </Fragment>
                  ))}
              </Grid>

              <DialogActions>
                <Button onClick={handleClose} disabled={loading} color="error">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={25} /> : "Add Budget"}
                </Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default BudgetAddModal;
