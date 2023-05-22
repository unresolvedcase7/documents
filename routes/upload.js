const express = require("express");
const multer = require("multer");
const router = express.Router();
const File = require("../models/File");

// Set up multer storage and file filtering
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only PDF files are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

// Handle file upload
router.post("/", upload.array("files", 100), async (req, res) => {
  try {
    const { category } = req.body;
    const files = req.files;

    // Save the uploaded files to the database
    const savedFiles = await File.create(
      files.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        category,
      }))
    );

    // Return a response indicating success
    res.json({ message: "Files uploaded successfully.", files: savedFiles });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the files." });
  }
});

router.get("/", function (req, res) {
  if (!req.isAuthenticated()) {
    req.flash("error", "You need to login to access this page.");
    return res.redirect("/auth/login");
  }
  res.render("upload-form");
});
module.exports = router;
