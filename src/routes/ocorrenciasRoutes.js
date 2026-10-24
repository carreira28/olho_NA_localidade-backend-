import { Router } from "express";
import {
  getAllProblems,
  createProblem,
} from "../controllers/ocorrenciasController.js";
import {
  authenticateToken,
  apenasCidadao,
} from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/problemas", authenticateToken, getAllProblems);
router.post(
  "/problema",
  authenticateToken,
  apenasCidadao,
  upload.array("fotos"),
  createProblem,
);

export default router;
