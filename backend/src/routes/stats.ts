import { Router } from "express";
import { prisma } from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

export const statsRouter = Router();

// Общая статистика
statsRouter.get("/", requireAdmin, async (_req, res) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalBookings, weekBookings, monthBookings, totalArtists, totalServices, statusCounts, artistBookings, dailyBookings] = await Promise.all([
    // Всего заявок
    prisma.booking.count(),
    // За неделю
    prisma.booking.count({ where: { createdAt: { gte: weekAgo } } }),
    // За месяц
    prisma.booking.count({ where: { createdAt: { gte: monthAgo } } }),
    // Всего мастеров
    prisma.artist.count(),
    // Всего услуг
    prisma.service.count(),
    // По статусам
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),
    // Заявки по мастерам
    prisma.booking.groupBy({
      by: ["artistId"],
      _count: true,
      orderBy: { _count: { artistId: "desc" } },
    }),
    // Заявки по дням за последний месяц
    prisma.booking.findMany({
      where: { createdAt: { gte: monthAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Группировка по дням
  const dailyMap: Record<string, number> = {};
  for (let d = new Date(monthAgo); d <= now; d.setDate(d.getDate() + 1)) {
    dailyMap[d.toISOString().split("T")[0]!] = 0;
  }
  dailyBookings.forEach((b) => {
    const day = b.createdAt.toISOString().split("T")[0]!;
    if (dailyMap[day] !== undefined) dailyMap[day]!++;
  });

  // Имена мастеров для статистики
  const artistIds = artistBookings.map((a) => a.artistId);
  const artists = await prisma.artist.findMany({
    where: { id: { in: artistIds } },
    select: { id: true, name: true },
  });
  const artistMap = Object.fromEntries(artists.map((a) => [a.id, a.name]));

  res.json({
    overview: {
      totalBookings,
      weekBookings,
      monthBookings,
      totalArtists,
      totalServices,
    },
    byStatus: statusCounts.map((s) => ({
      status: s.status,
      count: s._count,
    })),
    byArtist: artistBookings.map((a) => ({
      artistId: a.artistId,
      name: artistMap[a.artistId] || "Неизвестный",
      count: a._count,
    })),
    daily: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
  });
});
