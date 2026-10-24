import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import AuthRoutes from "./src/routes/AuthRoutes.js";
import OcorrenciasRoutes from "./src/routes/ocorrenciasRoutes.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const PORT = process.env.SERVER_PORT || 3000;

app.use("/auth", AuthRoutes);
app.use("/api", OcorrenciasRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
