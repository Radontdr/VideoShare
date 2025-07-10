import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config({path:"../.env"})

const getAccesstokenandRefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = user.generateaccesstoken();
    const RefreshToken = user.generaterefreshtoken();
    user.refreshtoken = RefreshToken;
    await user.save({ validateBeforeSave: false });
    return { AccessToken, RefreshToken };
  } catch (error) {
    throw error;
  }
};

export const refreshaccesstoken = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refresh_token || req.body.refresh_token;
  if (!incomingRefreshToken) {
    return next(createError(401, "Invalid token"));
  }

  try {
    const validatedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_SECRET);

    const user = await User.findById(validatedToken?._id); // Use .id, not _id (based on your JWT payload)
    if (!user) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return next(createError(400, "User not found")); // Don’t let it keep going
}

    if (incomingRefreshToken !== user.refreshtoken) {
      return next(createError(401, "Refresh token is expired or does not match"));
    }

    const options = {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)

    };

    const { AccessToken: newAccessToken, RefreshToken: newRefreshToken } = await getAccesstokenandRefreshtoken(user._id);

    res
      .status(200)
      .cookie("access_token", newAccessToken, options)
      .cookie("refresh_token", newRefreshToken, options)
      .json(
          {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
          },
        )
  } catch (error) {
    return next(createError(500, error?.message || "Invalid refresh token"));
  }
};


export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const { AccessToken, RefreshToken } = await getAccesstokenandRefreshtoken(user._id);
    const { password, ...others } = user._doc;

    res
      .cookie("access_token", AccessToken, {
        httpOnly: true,
      })
      .cookie("refresh_token", RefreshToken, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const { AccessToken, RefreshToken } = await getAccesstokenandRefreshtoken(user._id);
      res
        .cookie("access_token", AccessToken, {
          httpOnly: true,
        })
        .cookie("refresh_token", RefreshToken, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const { AccessToken, RefreshToken } = await getAccesstokenandRefreshtoken(savedUser._id);
      res
        .cookie("access_token", AccessToken, {
          httpOnly: true,
        })
        .cookie("refresh_token", RefreshToken, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
