import * as departamentosServices from "../services/departamentosServices.js";

const getAllDepartments = async (req, res, next) => {
  try {
    const departamento = await departamentosServices.getAllDepartments();
    return res.status(200).json(departamento);
  } catch (err) {
    next(err);
  }
};

const createDepartments = async (req, res, next) => {
  try {
    const departamento = await departamentosServices.createDepartments(
      req.body,
    );
    return res.status(200).json(departamento);
  } catch (err) {
    next(err);
  }
};

export { getAllDepartments, createDepartments };
