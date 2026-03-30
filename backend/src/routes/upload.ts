import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import { supabase } from "../supabaseClient";
import { requireAdmin } from "../middleware/auth";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // макс 5 МБ

export const uploadRouter = Router();

// Загрузить фото (🔒 требует токен)
uploadRouter.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Файл не загружен" });
    return;
  }

  const ext = path.extname(req.file.originalname);
  const fileName = `${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
    });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

  res.json({ url: data.publicUrl });
});
