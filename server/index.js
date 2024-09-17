import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions.js";
import { errorHandler, loginLimiter } from "./middleware/index.js";
import { removeBackground } from "@imgly/background-removal-node";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

const upload = multer({ dest: "uploads/" });

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
      return res.status(400).json({ error: "Nessun file caricato" });
    }

    const imgSource = req.file.path;

    const blob = await removeBackground(imgSource);

    const buffer = Buffer.from(await blob.arrayBuffer());

    res.json({
      message: "Background removed successfully.",
      resultImage: `data:image/png;base64,${buffer.toString("base64")}`,
    });

    fs.unlinkSync(imgSource);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Errore nella rimozione dello sfondo" });
  }
}

app.post("/remove-background", upload.single("image"), removeImageBackground);

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
