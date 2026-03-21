import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT || 3000);
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const WORKER_INTERVAL = Number(process.env.WORKER_INTERVAL || 5000);
export const MAX_RETRIES = Number(process.env.MAX_RETRIES || 3);

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}