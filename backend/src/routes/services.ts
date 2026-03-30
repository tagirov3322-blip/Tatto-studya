import { Router } from "express";
import { prisma } from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

export const serviceRouter = Router();

// Получить все услуги
serviceRouter.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });
  res.json(services);
});

// Создать услугу
serviceRouter.post("/", requireAdmin, async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  if (!name || price === undefined) {
    res.status(400).json({ error: "name and price are required" });
    return;
  }
  const service = await prisma.service.create({
    data: { name, description, price: Number(price), imageUrl },
  });
  res.status(201).json(service);
});

// Обновить услугу
serviceRouter.put("/:id", requireAdmin, async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: { name, description, price: price !== undefined ? Number(price) : undefined, imageUrl },
  });
  res.json(service);
});

// Удалить услугу
serviceRouter.delete("/:id", async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
