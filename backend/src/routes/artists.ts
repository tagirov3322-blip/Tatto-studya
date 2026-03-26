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
