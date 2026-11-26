import { Router } from "express";

import {
  getAllDepartments,
  createDepartments,
  updateDepartments,
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

router.patch(
  "/departamento/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  updateDepartments,
);

export default router;
