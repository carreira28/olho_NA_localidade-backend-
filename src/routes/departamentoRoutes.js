import { Router } from "express";

import {
  getAllDepartments,
  createDepartments,
} from "../controllers/departamentosController.js";

import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.get(
  "/departamentos",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  getAllDepartments,
);

router.post(
  "/departamento",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  createDepartments,
);

export default router;
