import asyncHandler from "express-async-handler";
import Cart from "../models/cart";
import Product from "../models/product";

export const addToCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  const user = req.user._id;
  let userCart;

  const cartExists = await Cart.findOne({ user: user });
  if (cartExists) {
    const productExist = cartExists.cartItems.find(
      (cartItem) => cartItem.product == cartItems.product
    );

    if (productExist) {
      const newQuantity = productExist.quantity + cartItems.quantity;
      // userCart = await Cart.findOneAndUpdate(
      //   {
      //     user: user,
      //     'cartItems.product': cartItems.product,
      //   },
      //   { $set: { cartItems: { ...cartItems, quantity: newQuantity } } }
      // )
      userCart = await Cart.findOneAndUpdate(
        {
          $and: [{ user: user }, { "cartItems.$.product": cartItems.product }],
        },
        { $set: { cartItems: { ...cartItems, quantity: newQuantity } } }
      );
    } else {
      const userCart = await Cart.findOneAndUpdate(
        { user: user },
        { $push: { cartItems: cartItems } }
      );
    }

    res.status(201).json({ userCart });
  } else {
    const userCart = await Cart.create({ user, cartItems: [cartItems] });
    res.status(201).json({ userCart });
  }
  // res.status(201).json(userCart)
});

export const getCartItems = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const userProducts = [];
  let totalPrice = 0;
  try {
    const userCart = await Cart.findOne({ user: user });
    for (var i = 0; i < userCart.cartItems.length; i++) {
      let userCartItems = userCart.cartItems[i];
      let productId = userCartItems.product;
      let product = await Product.findOne({ _id: productId });
      userProducts.push({ product, userCartItems });
      totalPrice += product.price * userCartItems.quantity;
    }
    res.status(200).json({ userProducts, totalPrice });
  } catch (error) {
    res.json({ message: "Could not find cart" });
  }
});
