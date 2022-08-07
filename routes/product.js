import express from "express";
import {
  getAllProducts,
  getProductById,
  getBrandsAndThumbnails,
  getCategories,
} from "../controllers/product";
const router = express.Router();

//express-async-handler eliminates the repeated use of trycatch blocks

// @desc Fetch all pro ducts
// @route GET /api/products
// @access Public
router.route("/").get(getAllProducts);

// @desc Fetch all products for admin
// @route GET /api/products
// @access Public
router.route("/").get();

router.route("/brands").get(getBrandsAndThumbnails);
router.route("/categories").get(getCategories);
// @desc Fetch a product
// @route GET /api/products/:id
// @access Public
router.route("/:id").get(getProductById);

export default router;
