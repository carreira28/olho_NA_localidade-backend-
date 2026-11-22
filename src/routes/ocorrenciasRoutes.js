import { Router } from "express";
import {
  getAllProblems,
  getProblem,
  getProblemsForManagement,
  getCategorias,
  createProblem,
  setLocation,
  getProblemForManagement,
  getPriorities,
  rejectProblem,
  validateProblem,
} from "../controllers/ocorrenciasController.js";
import {
  authenticateToken,
  apenasCidadao,
  requirePerfil,
  apenasCidadaoOuAdmin,
} from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/problemas", authenticateToken, apenasCidadao, getAllProblems);
router.get("/problema/:id", authenticateToken, apenasCidadao, getProblem);
router.get("/categorias", authenticateToken, getCategorias);

router.get(
  "/gestao/problemas",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "FUNCIONARIO MUNICIPAL", "SUPER ADMIN"),
  getProblemsForManagement,
);

router.get(
  "/gestao/problemas/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "FUNCIONARIO MUNICIPAL", "SUPER ADMIN"),
  getProblemForManagement,
);
router.post(
  "/problema",
  authenticateToken,
  apenasCidadao,
  upload.array("fotos"),
  createProblem,
);

router.patch(
  "/problemas/:id/localizacao",
  authenticateToken,
  apenasCidadaoOuAdmin,
  setLocation,
);

router.get("/prioridades", authenticateToken, getPriorities);

router.patch(
  "/problemas/:id/validar",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  validateProblem,
);

router.patch(
  "/problemas/:id/rejeitar",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  rejectProblem,
);

export default router;
