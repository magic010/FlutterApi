import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
} from "../controllers/order";
import { requireSignin } from "../middlewares";

const router = express.Router();

// @desc Create new order
// @route POST /api/order
// @access Private
router.route("/").post(requireSignin, createOrder);

// @desc Get order by id
// @route GET /api/order/:id
// @access Private
router.route("/:id").get(requireSignin, getOrderById);

// @desc Get order by id and update the payment status
// @route GET /api/order/:id/pay
// @access Private
router.route("/:id/pay").post(requireSignin, updateOrderToPaid);

// @desc Get all order
// @route GET /api/order/
// @access Private
router.route("/").get(requireSignin, getAllOrders);

export default router;
