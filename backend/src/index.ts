import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { artistRouter } from "./routes/artists";
import { bookingRouter } from "./routes/bookings";
import { portfolioRouter } from "./routes/portfolio";
import { serviceRouter } from "./routes/services";
import { notificationRouter } from "./routes/notifications";
import { authRouter } from "./routes/auth";
import { uploadRouter } from "./routes/upload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Роуты
app.use("/api/artists", artistRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/services", serviceRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);

// Проверка работоспособности
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
