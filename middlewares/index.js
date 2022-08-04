import jwt from "jsonwebtoken";
import User from "../models/user";

export const requireSignin = async (req, res, next) => {
  let fullToken = req.headers.authorization;
  let token;
  if (fullToken && fullToken.startsWith("Bearer")) {
    try {
      token = fullToken.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
      throw new Error("Invalid token");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("No token found");
  }
  next();
};

export const isAuth = (req, res, next) => {
  try {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json(err);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isAdmin) {
      next();
    } else {
      return res.status(401).json({
        error: "Not authorized",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
