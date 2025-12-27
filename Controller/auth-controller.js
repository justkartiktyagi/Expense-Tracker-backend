const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const path = require("path");

exports.getSignup = (req, res) => {
  res.sendFile(path.join(__dirname, "../Views/auth/signup.html"));
};

exports.signup = [
  check("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long.")
    .matches(/^[A-Za-z ]+$/)
    .withMessage("Name can contain only letters and spaces."),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character.")
    .trim(),
  check("confirmpassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save(); // ✅ CRITICAL

      return res.status(201).json({
        message: "User registered successfully.",
      });
    } catch (error) {
      console.error("SIGNUP ERROR 👉", error);
      return res.status(500).json({
        message: "Error registering user.",
      });
    }
  },
];

exports.getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, "../Views/auth/login.html"));
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    return res.status(500).json({
      message: "Error logging in.",
    });
  }
};
