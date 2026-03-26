import { Router } from "express";
import { prisma } from "../prismaClient";

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
