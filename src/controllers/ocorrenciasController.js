import * as OcorrenciasServices from "../services/ocorrenciasServices.js";

const getAllProblems = async (req, res, next) => {
  try {
    const problem = await OcorrenciasServices.getAllProblems(req.user.id);
    return res.status(200).json(problem);
  } catch (err) {
    next(err);
  }
};

const getProblem = async (req, res, next) => {
  try {
    const problem = await OcorrenciasServices.getProblem(
      req.user.id,
      Number(req.params.id),
    );
    return res.status(200).json(problem);
  } catch (err) {
    next(err);
  }
};

const getCategorias = async (req, res, next) => {
  try {
    return res.status(200).json(await OcorrenciasServices.getCategorias());
  } catch (err) {
    next(err);
  }
};

const getAllProblemsOfAllCitizen = async (req, res, next) => {
  try {
    const problemas = await OcorrenciasServices.getAllProblemsOfAllCitizen();
    return res.status(200).json(problemas);
  } catch (err) {
    next(err);
  }
};

const createProblem = async (req, res, next) => {
  try {
    const problem = await OcorrenciasServices.createProblem(
      req.body,
      req.files,
      req.user.id,
    );
    return res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
};

export {
  getAllProblems,
  getProblem,
  getAllProblemsOfAllCitizen,
  getCategorias,
  createProblem,
};
