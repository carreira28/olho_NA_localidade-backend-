import { Router } from "express";
import { getAllcategory } from "../controllers/categoriaContoller.js";

import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.get(
  "/category",
  authenticateToken,
  requirePerfil("ADMINISTRADOR"),
  getAllcategory,
);

export default router;
