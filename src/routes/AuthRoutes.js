import { Router } from "express";

import {
  signup,
  signin,
  criarFuncionario,
  me,
} from "../controllers/AuthController.js";
import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authenticateToken, me);
//!corrigir funcionario
router.post(
  "/funcionarios",
  authenticateToken,
  requirePerfil("admin"),
  criarFuncionario,
);

export default router;
