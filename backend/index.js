import express from "express";
import { config } from "dotenv";
import cookie from "cookie-parser";
import cors from "cors";
import path from "path";

config();
const app = express();
app.use(cookie());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 3000;

// Import routes
import authRoutes from "./routes/auth.route.js";
import locationRoutes from "./routes/location.route.js";
import jobRoutes from "./routes/job.route.js";
import applyRoutes from "./routes/apply.route.js";

// Routes
//AUth

app.use("/auth", authRoutes);
app.use("/locations", locationRoutes);
app.use("/jobs", jobRoutes);
app.use("/apply", applyRoutes);
app.listen(PORT, (req, res) => {
  console.log("SERVER is running on PORT ", PORT);
});
