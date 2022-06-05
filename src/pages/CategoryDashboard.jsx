import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {Container, Box, Paper, Typography} from "@mui/material";

import CategoryForm from "../components/categoryComponents/CategoryForm";
import CategoryList from "../components/categoryComponents/CategoryList";
import CategoryLoader from "../components/categoryComponents/CategoryLoader";

import {
  getUserCategories,
  deleteCategory as delCatAction,
  updateCategory as updCatAction,
  resetMessage,
} from "../features/categories/categoriesSlice";

function CategoryDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    categories,
    isError,
    isSuccess,
    isUpdating,
    isLoading,
    isDeleting,
    message,
  } = useSelector((state) => state.categories);

  const updateCategory = (category) => {
    dispatch(updCatAction(category));
  };
  const deleteCategory = (id) => {
    dispatch(delCatAction(id));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.token) dispatch(getUserCategories());
  }, [user, dispatch]);

  useEffect(() => {

    if (isError && message) {
      toast.error(Array.isArray(message) ? message.join("\n") : message);
      console.log("clear cat error message")
      dispatch(resetMessage());
    }
    
    if (isSuccess && message) {
      toast.success(message);
      console.log("clear cat success message")
      dispatch(resetMessage());
    }

  }, [user, isError, isSuccess, message, dispatch]);

  return (
    <Container maxWidth="lg" sx={{ my: 1 }}>
      <Box>
        <Paper elevation={3}>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            align="center"
            sx={{ py: 2 }}
          >
            Category dashboard
          </Typography>
          <CategoryForm />
          <CategoryList
            categories={categories}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
            updating={isUpdating}
            deleting={isDeleting}
          />
          {isLoading && (
            <Box sx={{ m: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <CategoryLoader key={`cat-loader-${i}`} />
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default CategoryDashboard;
