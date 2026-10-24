import { Router } from "express";

import {
  signup,
  signin,
  criarFuncionario,
  me,
} from "../controllers/authController.js";
import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authenticateToken, me);
router.post(
  "/funcionarios",
  authenticateToken,
  requirePerfil("ADMINISTRADOR"),
  criarFuncionario,
);

export default router;
