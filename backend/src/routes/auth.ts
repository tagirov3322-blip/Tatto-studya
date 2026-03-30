import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// Логин админа
authRouter.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Неверный логин или пароль" });
    return;
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  res.json({ token });
});
