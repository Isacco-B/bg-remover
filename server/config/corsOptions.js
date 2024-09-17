import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = process.env.ALLOWD_HOSTS.split(",");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
