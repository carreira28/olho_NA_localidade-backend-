import * as departamentosServices from "../services/departamentosServices.js";

const getAllDepartamentes = async (req, res, next) => {
  try {
    const departamento = await departamentosServices.getAllDepartamentes();
    return res.status(200).json(departamento);
  } catch (err) {
    next(err);
  }
};

export { getAllDepartamentes };
