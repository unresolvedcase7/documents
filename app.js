const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const db = require("./db");
const uploadRoutes = require("./routes/upload");
const pdfRoutes = require("./routes/pdf");
const authRoutes = require("./routes/auth");
require("./passport")(passport);
const app = express();
const PORT = process.env.PORT || 3000;

// Set up views directory and Pug as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// Connect to MongoDB
db;

// Configure session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});
// Mount routes
app.use("/upload", uploadRoutes);
app.use("/documents", pdfRoutes);
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
