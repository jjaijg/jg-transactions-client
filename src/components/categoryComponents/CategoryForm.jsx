import React, { useEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createCategory, resetMessage } from "../../features/categories/categoriesSlice";

export const CategoryForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  // isError, isLoading, message
  const { isSuccess } = useSelector(
    (state) => state.categories
  );

  const handleChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) toast.error("Category name is required!");
    else {
      dispatch(createCategory({ name }));
    }
  };

  useEffect(() => {
    if (isSuccess && name) {
      setName("");
    }
    dispatch(resetMessage());
  }, [isSuccess, name, dispatch]);

  return (
    <div>
      <Grid
        spacing={2}
        container
        component="form"
        noValidate
        autoComplete="off"
        justifyContent={"center"}
        alignItems={"center"}
        onSubmit={handleSubmit}
      >
        <Grid item md={12} lg={9} sx={{ mx: 1 }}>
          <TextField
            required
            type={"name"}
            name="name"
            id="name"
            label="Category name"
            fullWidth
            value={name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item md={12} lg={2} alignSelf={"stretch"}>
          <Button
            color="success"
            variant="contained"
            type="submit"
            sx={{ height: "100%" }}
          >
            Add category
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryForm;
