import { Router } from "express";

import { getAllDepartamentes } from "../controllers/departamentosController.js";

import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.get(
  "/departmantos",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  getAllDepartamentes,
);

export default router;
