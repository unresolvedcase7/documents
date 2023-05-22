const express = require("express");
const router = express.Router();
const File = require("../models/File");

// Display all PDFs
router.get("/:category", async (req, res) => {
  const category = req.params.category;
  try {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      req.flash("error", "You need to login to access this page.");
      return res.redirect("/auth/login");
    }

    // Retrieve all files from the database
    const files = await File.find({ category });

    // Render the PDFs view and pass the files data
    res.render("pdfs", { files });
  } catch (error) {
    console.error("Error retrieving files:", error);
    req.flash("error", "An error occurred while retrieving the files.");
    res.redirect(`/documents/${category}`);
  }
});

// Download PDF
router.get("/:category/:id", async (req, res) => {
  const category = req.params.category;

  try {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      req.flash("error", "You need to login to access this page.");
      return res.redirect("/auth/login");
    }

    const fileId = req.params.id;

    // Retrieve the file from the database
    const file = await File.findById(fileId);
    if (!file) {
      req.flash("error", "File not found.");
      return res.redirect(`/documents/${category}`);
    }
    // Check if the user has already downloaded three files
    if (req.user.downloads >= 3) {
      req.flash("error", "You have reached the download limit of three files.");
      return res.redirect(`/documents/${category}`);
    } else {
      // Increment the user's download count
      req.user.downloads += 1;
      await req.user.save();

      // Send the PDF file as a download
      res.download(file.path, file.filename);
    }
  } catch (error) {
    console.error("Error retrieving file:", error);
    req.flash("error", "An error occurred while retrieving the file.");
    res.redirect(`/documents/${category}`);
  }
});

module.exports = router;
