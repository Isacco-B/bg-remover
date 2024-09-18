import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import fsPromises from "fs/promises";
import path, { dirname } from "path";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions.js";
import { fileURLToPath } from "url";
import { removeBackground } from "@imgly/background-removal-node";
import { loginLimiter } from "./middleware/loginLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_SIZE = 5 * 1024 * 1024;

app.use(cors(corsOptions));

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
      message: "Only images (.jpeg, .jpg, .png, .webp) are allowed!",
    });
  },
}).single("image");

async function removeImageBackground(req, res, next) {
  if (!req.file) {
    return errorHandler(400, "File not found");
  }

  try {
    const imgSource = req.file.path;
    const blob = await removeBackground(imgSource);
    const buffer = Buffer.from(await blob.arrayBuffer());

    res.json({
      message: "Your image has been processed.",
      resultImage: `data:image/png;base64,${buffer.toString("base64")}`,
    });

    try {
      await fsPromises.unlink(imgSource);
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError);
    }
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

app.listen(PORT, () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? `${process.env.HOST}`
      : `http://localhost:${PORT}`;

  console.log(`Listening on ${baseURL}`);
});
