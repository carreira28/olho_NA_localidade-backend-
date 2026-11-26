import { Router } from "express";

import {
  getAllAccounts,
  getEmployeeHistory,
  getCitizenHistory,
} from "../controllers/utilizadoresContriller.js";

import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.get(
  "/utilizadores",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  getAllAccounts,
);
router.get(
  "/utilizadore/funcionario/historico/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  getEmployeeHistory,
);
router.get(
  "/utilizadore/cidadao/historico/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  getCitizenHistory,
);

export default router;
