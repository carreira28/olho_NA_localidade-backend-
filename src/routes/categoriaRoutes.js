import { Router } from "express";
import {
  getAllcategory,
  createCategoria,
  updateCategory,
} from "../controllers/categoriaContoller.js";

import {
  authenticateToken,
  requirePerfil,
} from "../middlewares/authenticate.js";

const router = Router();

router.get(
  "/categorias",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  getAllcategory,
);

router.post(
  "/categoria",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  createCategoria,
);

router.patch(
  "/categoria/:id",
  authenticateToken,
  requirePerfil("ADMINISTRADOR", "SUPER ADMIN"),
  updateCategory,
);

export default router;
