import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { createCategory, reset } from "../features/categories/categoriesSlice";

export const CategoryForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const { isSuccess, isError, isLoading, message } = useSelector(
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
    dispatch(reset());
  }, [isSuccess, name, dispatch]);

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2, width: "100ch" },
          display: "flex",
          //   flexDirection: "column",
          //   alignItems: "center",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          required
          type={"name"}
          name="name"
          id="name"
          label="Category name"
          value={name}
          onChange={handleChange}
        />
        <Button
          color="success"
          variant="contained"
          type="submit"
          sx={{ my: 2 }}
        >
          Add category
        </Button>
      </Box>
    </div>
  );
};

export default CategoryForm;
