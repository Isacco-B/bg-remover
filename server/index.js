import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions.js";
import { removeBackground } from "@imgly/background-removal-node";
import { loginLimiter } from "./middleware/loginLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MAX_SIZE = 5 * 1024 * 1024;

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, callback) => {
    const filetypes = /png|jpg|jpeg|webp/;
    const mimeType = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback({
      statusCode: 400,
      message:
        "Image upload only supports the following filetypes - jpeg, jpg, png, webp",
    });
  },
}).single("image");

//const upload = multer({ dest: "uploads/" });

app.listen(PORT, () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? `${process.env.HOST}`
      : `http://localhost:${PORT}`;

  console.log(`Listening on ${baseURL}`);
});

async function removeImageBackground(req, res, next) {
  try {
    if (!req.file) {
      return errorHandler(400, "File not found");
    }

    const imgSource = req.file.path;

    const blob = await removeBackground(imgSource);

    const buffer = Buffer.from(await blob.arrayBuffer());

    res.json({
      message: "Your image has been processed.",
      resultImage: `data:image/png;base64,${buffer.toString("base64")}`,
    });

    fs.unlinkSync(imgSource);
  } catch (error) {
    next(error);
  }
}

app.post(
  "/remove-background",
  loginLimiter,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return next(errorHandler(400, err.message));
      } else if (err) {
        return next(err);
      }
      next();
    });
  },
  removeImageBackground
);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res
    .status(statusCode)
    .json({ success: false, statusCode, message, isError: true });
});
