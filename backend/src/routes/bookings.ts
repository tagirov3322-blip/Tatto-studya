import { Router } from "express";
import { prisma } from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

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
    orderBy: { createdAt: "desc" },
  });
  res.json(bookings);
});

// Обновить статус заявки
bookingRouter.put("/:id", async (req, res) => {
  const { status } = req.body;
  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status },
    include: { artist: true },
  });
  res.json(booking);
});

// Удалить заявку
bookingRouter.delete("/:id", async (req, res) => {
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
