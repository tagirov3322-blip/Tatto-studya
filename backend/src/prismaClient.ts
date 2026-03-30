import dotenv from "dotenv";
dotenv.config();

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({
  host: "aws-1-eu-west-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.ucqgyzuwvpjyfpwucdpe",
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});
export const prisma = new PrismaClient({ adapter });
