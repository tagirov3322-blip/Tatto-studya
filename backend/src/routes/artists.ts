import { Router } from "express";
import { prisma } from "../prismaClient";

export const artistRouter = Router();

// Получить всех мастеров
artistRouter.get("/", async (_req, res) => {
  const artists = await prisma.artist.findMany({
    include: { portfolioItems: true },
  });
  res.json(artists);
});

// Получить мастера по ID
artistRouter.get("/:id", async (req, res) => {
  const artist = await prisma.artist.findUnique({
    where: { id: req.params.id },
    include: { portfolioItems: true },
  });
  if (!artist) {
    res.status(404).json({ error: "Artist not found" });
    return;
  }
  res.json(artist);
});

// Создать мастера
artistRouter.post("/", async (req, res) => {
  const { name, bio, photoUrl, styles } = req.body;
  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const artist = await prisma.artist.create({
    data: { name, bio, photoUrl, styles: styles ?? [] },
  });
  res.status(201).json(artist);
});

// Обновить мастера
artistRouter.put("/:id", async (req, res) => {
  const { name, bio, photoUrl, styles } = req.body;
  const artist = await prisma.artist.update({
    where: { id: req.params.id },
    data: { name, bio, photoUrl, styles },
  });
  res.json(artist);
});

// Удалить мастера
artistRouter.delete("/:id", async (req, res) => {
  await prisma.artist.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
