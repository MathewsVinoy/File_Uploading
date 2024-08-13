const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const maxSize = 10 * 10000 * 10000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png|zip|txt/;
    var mimetype = file.mimetype;
    var extname = path.extname(file.originalname).toLowerCase();

    if (
      mimetype.includes("image/jpeg") ||
      mimetype.includes("image/jpg") ||
      mimetype.includes("image/png") ||
      filetypes.test(extname)
    ) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).single("mypic");

app.get("/", function (req, res) {
  res.render("main");
});

app.post("/uploadProfilePicture", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      console.error(req.file); // Add this line
      res.status(500).send(`Error uploading file: ${err.message}`);
    } else {
      res.send("Success, Image uploaded!");
    }
  });
});

app.listen(5000, function (error) {
  if (error) throw error;
  console.log("Server created Successfully on PORT 5000");
});
