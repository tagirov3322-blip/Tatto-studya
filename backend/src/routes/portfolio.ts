import { Router } from "express";
import { prisma } from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

export const portfolioRouter = Router();

// Получить все работы
portfolioRouter.get("/", async (req, res) => {
  const { style, artistId } = req.query;

  const where: Record<string, unknown> = {};
  if (style) where.style = style;
  if (artistId) where.artistId = artistId;

  const items = await prisma.portfolioItem.findMany({
    where,
    include: { artist: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

// Добавить работу в портфолио
portfolioRouter.post("/", requireAdmin, async (req, res) => {
  const { imageUrl, title, style, artistId } = req.body;
  if (!imageUrl || !artistId) {
    res.status(400).json({ error: "imageUrl and artistId are required" });
    return;
  }
  const item = await prisma.portfolioItem.create({
    data: { imageUrl, title, style, artistId },
    include: { artist: true },
  });
  res.status(201).json(item);
});

// Обновить работу
portfolioRouter.put("/:id", requireAdmin, async (req, res) => {
  const { imageUrl, title, style } = req.body;
  const item = await prisma.portfolioItem.update({
    where: { id: req.params.id },
    data: { imageUrl, title, style },
    include: { artist: true },
  });
  res.json(item);
});

// Удалить работу
portfolioRouter.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.portfolioItem.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
