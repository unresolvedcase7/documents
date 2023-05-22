const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Render the login form for admin
router.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/upload");
  }
  res.render("admin_login");
});

// Handle login form submission for admin
router.post(
  "/admin",
  passport.authenticate("local", {
    successRedirect: "/upload",
    failureRedirect: "/auth/admin",
    failureFlash: true,
  })
);

// Render the login form for puzzle1
router.get("/login/puzzle1", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/documents/puzzle1");
  }
  res.render("login_puzzle1");
});

// Handle login form submission for puzzle1
router.post(
  "/login/puzzle1",
  passport.authenticate("local", {
    successRedirect: "/documents/puzzle1",
    failureRedirect: "/auth/login/puzzle1",
    failureFlash: true,
  })
);

// Render the login form for puzzle2
router.get("/login/puzzle2", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/documents/puzzle2");
  }
  res.render("login_puzzle2");
});

// Handle login form submission for puzzle2
router.post(
  "/login/puzzle2",
  passport.authenticate("local", {
    successRedirect: "/documents/puzzle2",
    failureRedirect: "/auth/login/puzzle2",
    failureFlash: true,
  })
);

// Render the login form for puzzle3
router.get("/login/puzzle3", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/documents/puzzle3");
  }
  res.render("login_puzzle3");
});

// Handle login form submission for puzzle3
router.post(
  "/login/puzzle3",
  passport.authenticate("local", {
    successRedirect: "/documents/puzzle3",
    failureRedirect: "/auth/login/puzzle3",
    failureFlash: true,
  })
);

router.post("/zapier", async (req, res) => {
  try {
    // Extract customer information from the request body
    const { id } = req.body;

    // Create a new user in MongoDB
    const newUser = new User({ username: id });
    await newUser.save();

    // Send a response back to Zapier
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
module.exports = router;
