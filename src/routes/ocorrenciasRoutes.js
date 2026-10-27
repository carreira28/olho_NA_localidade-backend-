import { Router } from "express";
import {
  getAllProblems,
  createProblem,
  getCategorias,
  getProblem,
  getAllProblemsOfAllCitizen,
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
router.post(
  "/problema",
  authenticateToken,
  apenasCidadao,
  upload.array("fotos"),
  createProblem,
);

export default router;
