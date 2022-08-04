import express from "express";
// middleware
import { requireSignin } from "../middlewares";

const router = express.Router();

// controllers
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  signout,
} = require("../controllers/auth");

router.get("/", (req, res) => {
  return res.json({
    data: "hello world from FlutterEcomApp auth API",
  });
});
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/signout", signout);
router.get("/auth-check", requireSignin, (req, res) => {
  res.json({ ok: true });
});

export default router;
