import asyncHandler from "express-async-handler";
import Order from "../models/order";

// @desc Create new order
// @route POST /api/order
// @access Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  let createdOrder;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No items in order");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    createdOrder = await order.save();
  }

  res.status(201).json({ message: "Order created successfully", createdOrder });
});

// @desc Get order by id
// @route GET /api/order/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const uid = req.user.id;

  const userOrder = await Order.findById(orderId).populate(
    "user",
    "name email"
  );

  if (userOrder) {
    res.json({ userOrder });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc Get order by id
// @route GET /api/order/:id
// @access Private
export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const allOrders = await Order.find({});
    res.json({ allOrders });
  } catch (error) {
    res.status(404).json({ message: error.message, error });
  }
});

//not reqiured
// @desc Update Order to paid
// @route GET /api/order/:id/pay
// @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userOrder = await Order.findById(orderId);
  if (userOrder) {
    try {
      userOrder.isPaid = true;
      userOrder.paidAt = Date.now();

      userOrder.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updatedOrder = await userOrder.save();
      res.json({ message: "Payment was successful", updatedOrder });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Payment failed" });
    }
  } else {
    res.json({ message: "Order not found" });
  }
});
