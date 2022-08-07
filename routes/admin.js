import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
  updateProductByAdmin,
  createMultipleProducts,
} from "../controllers/product";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
} from "../controllers/auth";
import { isAdmin, requireSignin } from "../middlewares";

const router = express.Router();
//test
//express-async-handler eliminates the repeated use of trycatch blocks

//------------USER ROUTES------------------
// @desc Get all users
// @route POST /api/admin/users/
// @access Private/Admin
router.get("/users", requireSignin, isAdmin, getAllUsers);

// @desc Delete user
// @route POST /api/admin/users/:id
// @access Private/Admin
router
  .route("/users/:id")
  .delete(requireSignin, isAdmin, deleteUser)
  .get(requireSignin, isAdmin, getUserById)
  .put(requireSignin, isAdmin, updateUserByAdmin);

//------------PRODUCT ROUTES------------------
// @desc Get all products
// @route POST /api/admin/products
// @access Private/Admin
router
  .route("/products")
  .get(requireSignin, isAdmin, getAllProductsAdmin)
  .post(requireSignin, isAdmin, createProduct);

// @desc Other product routes like delete, put and get by id
// @route POST /api/admin/products/:id
// @access Private/Admin
router
  .route("/products/:id")
  .delete(requireSignin, isAdmin, deleteProduct)
  .get(requireSignin, isAdmin, getProductByIdAdmin)
  .put(requireSignin, isAdmin, updateProductByAdmin);

router.route("/product").post(requireSignin, isAdmin, createMultipleProducts);

export default router;
