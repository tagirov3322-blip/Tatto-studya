import { Router } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
export const bookingRouter = Router();

// Создать запись на сеанс
bookingRouter.post("/", async (req, res) => {
  const { name, phone, email, message, date, artistId } = req.body;

  if (!name || !phone || !date || !artistId) {
    res.status(400).json({ error: "name, phone, date, artistId are required" });
    return;
  }

  const booking = await prisma.booking.create({
    data: { name, phone, email, message, date: new Date(date), artistId },
  });
  res.status(201).json(booking);
});

// Получить все записи (для админки)
bookingRouter.get("/", async (_req, res) => {
  const bookings = await prisma.booking.findMany({
    include: { artist: true },
    orderBy: { date: "asc" },
  });
  res.json(bookings);
});
