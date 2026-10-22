import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const PORT = process.env.SERVER_PORT;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.get("/", async (req, res) => {
  const estado = await prisma.EstadoConta.findMany();
  res.status(200).json(estado);
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
