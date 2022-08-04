import express from "express";
import { addToCart, getCartItems, removeFromCart } from "../controllers/cart";
import { requireSignin } from "../middlewares";

const router = express.Router();
//test
//express-async-handler eliminates the repeated use of trycatch blocks

// @desc Get items from cart
// @route GET /api/cart/
// @access Private
router.route("/").get(requireSignin, getCartItems);

// @desc Add to cart
// @route POST /api/cart/add
// @access Private
router.route("/add").post(requireSignin, addToCart);

// @desc Remove from cart
// @route POST /api/cart/remove
// @access Private
router.route("/remove").put(requireSignin, removeFromCart);

export default router;
