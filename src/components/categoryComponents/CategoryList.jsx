// import { styled } from "@mui/material/styles";
import { useState } from "react";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import {Box, List, ListItem, ListItemText, IconButton, Grid, Typography} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/CancelRounded";

export const CategoryList = ({
  categories = [],
  onDelete,
  onUpdate,
  updating,
  deleting,
}) => {
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState("");

  const handleEdit = (id, name) => (_) => {
    setEditCategory(id);
    setName(name);
  };
  const handleCancelEdit = (_) => {
    setEditCategory(null);
    setName("");
  };

  const handleUpdateCat = (id, oldName, name) => (_) => {
    console.log(id, oldName, name);
    if (oldName === name) {
      toast.info("no changes made!");
      return;
    }
    if (!onUpdate) return;
    onUpdate({ id, name });
    setEditCategory(null);
    setName("");
  };

  const handleDelete = (id) => (_) => {
    const canDel = window.confirm("Are you sure?");
    if (!canDel) return;
    if (!onDelete) return;
    onDelete(id);
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const generateList = (categories, editCategory) => {
    return categories.map((cat) => {
      let catElement = null;
      if (editCategory && cat._id === editCategory) {
        catElement = (
          <ListItem
            sx={{
              "&:hover": { backgroundColor: "lightgray" },
            }}
            key={cat._id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  disabled={updating}
                  onClick={handleUpdateCat(cat._id, cat.name, name)}
                  color="success"
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="cancel"
                  disabled={updating}
                  onClick={handleCancelEdit}
                  color="error"
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            }
          >
            <TextField
              variant="standard"
              key={cat._id}
              required
              type={"text"}
              name="name"
              id="name"
              label="Category name"
              value={name}
              onChange={handleNameChange}
              fullWidth
              autoFocus
            />
          </ListItem>
        );
      } else {
        catElement = (
          <ListItem
            sx={{
              "&:hover": { backgroundColor: "lightgray" },
            }}
            key={cat._id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  disabled={deleting}
                  onClick={handleEdit(cat._id, cat.name)}
                  color="info"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  disabled={deleting}
                  onClick={handleDelete(cat._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={cat.name}
              secondary={`created at : ${new Date(cat.createdAt).toLocaleString(
                "en-US"
              )}`}
            />
          </ListItem>
        );
      }
      return catElement;
    });
  };

  return (
    <Box>
      <Grid item xs={12}>
        <Typography sx={{ mt: 4, mb: 2, mx: 1 }} variant="h6" component="div">
          Category List
        </Typography>
        <List>{generateList(categories, editCategory)}</List>
      </Grid>
    </Box>
  );
};

export default CategoryList;
