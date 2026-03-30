import { Router } from "express";
import { supabase } from "../supabaseClient";

export const notificationRouter = Router();

// SSE-стрим уведомлений о новых заявках
notificationRouter.get("/bookings", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Подписка на новые записи в таблице Booking
  const channel = supabase
    .channel("bookings-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Booking" },
      (payload) => {
        res.write(`data: ${JSON.stringify(payload.new)}\n\n`);
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "Booking" },
      (payload) => {
        res.write(`data: ${JSON.stringify({ ...payload.new, _event: "update" })}\n\n`);
      }
    )
    .subscribe();

  // Отправляем heartbeat каждые 30 сек чтобы соединение не закрылось
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 30000);

  // Очистка при отключении клиента
  req.on("close", () => {
    clearInterval(heartbeat);
    supabase.removeChannel(channel);
  });
});
