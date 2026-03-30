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
import { statsRouter } from "./routes/stats";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Безопасность
app.use(helmet()); // HTTP заголовки безопасности
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" })); // ограничение размера запроса

// Защита от брутфорса логина — 5 попыток за 15 минут
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Слишком много попыток входа. Попробуйте через 15 минут" },
});
app.use("/api/auth/login", loginLimiter);

// Защита от спама заявками — 20 заявок за час с одного IP (только POST)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Слишком много заявок. Попробуйте позже" },
});
app.post("/api/bookings", bookingLimiter);

// Общий лимит — 100 запросов в минуту
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Слишком много запросов" },
});
app.use("/api", generalLimiter);

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
