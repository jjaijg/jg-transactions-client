import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CategoryForm from "../components/CategoryForm";
import Spinner from "../components/Spinner";

import {
  getUserCategories,
  deleteCategory as delCatAction,
  updateCategory as updCatAction,
  reset,
} from "../features/categories/categoriesSlice";
import { toast } from "react-toastify";
import CategoryList from "../components/CategoryList";
import CategoryLoader from "../components/CategoryLoader";

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
    if (user) dispatch(getUserCategories());
  }, [user, dispatch]);

  useEffect(() => {
    if (isError && message) {
      console.log(message);
      toast.error(Array.isArray(message) ? message.join("\n") : message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    if (!user) {
      navigate("/login");
    }

    return dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch, navigate]);

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
