import { Router } from "express";
import {
  getAllProblems,
  createProblem,
  getCategorias,
  getProblem,
} from "../controllers/ocorrenciasController.js";
import {
  authenticateToken,
  apenasCidadao,
} from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/problemas", authenticateToken, apenasCidadao, getAllProblems);
router.get("/problema/:id", authenticateToken, apenasCidadao, getProblem);
router.get("/categorias", authenticateToken, getCategorias);
router.post(
  "/problema",
  authenticateToken,
  apenasCidadao,
  upload.array("fotos"),
  createProblem,
);

export default router;
