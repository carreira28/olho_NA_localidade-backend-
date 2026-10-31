import { Router } from "express";
import {
  getAllProblems,
  createProblem,
  getCategorias,
  getProblem,
  getAllProblemsOfAllCitizen,
  getProblemForManagement,
  getPrioridades,
  rejeitarProblema,
  validarProblema,
} from "../controllers/ocorrenciasController.js";
import {
  authenticateToken,
  apenasCidadao,
  requirePerfil,
} from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/problemas", authenticateToken, apenasCidadao, getAllProblems);
router.get("/problema/:id", authenticateToken, apenasCidadao, getProblem);
router.get("/categorias", authenticateToken, getCategorias);
router.get(
  "/OcorrenciasCidadao",
  authenticateToken,
  requirePerfil("ADMINISTRADOR"),
  getAllProblemsOfAllCitizen,
);
router.get(
  "/gestao/problemas/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "FUNCIONARIO MUNICIPAL"),
  getProblemForManagement,
);
router.post(
  "/problema",
  authenticateToken,
  apenasCidadao,
  upload.array("fotos"),
  createProblem,
);

router.get("/prioridades", authenticateToken, getPrioridades);

router.get(
  "/gestao/problemas/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "FUNCIONARIO MUNICIPAL"),
  getProblemForManagement,
);

router.patch(
  "/problemas/:id/validar",
  authenticateToken,
  requirePerfil("ADMINISTRADOR"),
  validarProblema,
);

router.patch(
  "/problemas/:id/rejeitar",
  authenticateToken,
  requirePerfil("ADMINISTRADOR"),
  rejeitarProblema,
);

export default router;
