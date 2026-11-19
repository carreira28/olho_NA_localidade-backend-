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

//!Não verificado
const setLocation = async (req, res, next) => {
  try {
    const resultado = await OcorrenciasServices.setLocation(
      Number(req.params.id),
      req.body,
    );
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

const getPriorities = async (req, res, next) => {
  try {
    return res.status(200).json(await OcorrenciasServices.getPriorities());
  } catch (err) {
    next(err);
  }
};

const getProblemForManagement = async (req, res, next) => {
  try {
    const problema = await OcorrenciasServices.getProblemForManagement(
      Number(req.params.id),
      req.user,
    );
    return res.status(200).json(problema);
  } catch (err) {
    next(err);
  }
};

const getProblemsForManagement = async (req, res, next) => {
  try {
    const problemas = await OcorrenciasServices.getProblemsForManagement(
      req.user,
    );
    return res.status(200).json(problemas);
  } catch (err) {
    next(err);
  }
};

const validateProblem = async (req, res, next) => {
  try {
    const problem = await OcorrenciasServices.validateProblem(
      Number(req.params.id),
      req.body,
      req.user.id,
    );
    return res.status(200).json(problem);
  } catch (err) {
    next(err);
  }
};

const rejectProblem = async (req, res, next) => {
  try {
    const problem = await OcorrenciasServices.rejectProblem(
      Number(req.params.id),
      req.user.id,
    );
    return res.status(200).json(problem);
  } catch (err) {
    next(err);
  }
};

export {
  getAllProblems,
  getProblem,
  getProblemsForManagement,
  getCategorias,
  createProblem,
  setLocation,
  getProblemForManagement,
  getPriorities,
  rejectProblem,
  validateProblem,
};
