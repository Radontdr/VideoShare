import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import User from "./models/user.model.js"; // Adjust the path as necessary
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "Not authenticated"));

  jwt.verify(token, process.env.JWT, async (err, decoded) => {
    if (err) return next(createError(403, "Invalid token"));

    // Check if user still exists in DB
    const user = await User.findById(decoded._id);
    if (!user) return next(createError(404, "User no longer exists"));

    req.user = user;
    next();
  });
};
