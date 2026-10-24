import * as OcorrenciasServices from "../services/ocorrenciasServices.js";

const getAllProblems = async (req, res, next) => {
  try {
    const problem = await OcorrenciasServices.getAllProblems(req.user.id);
    return res.status(200).json(problem);
  } catch (er) {
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

export { getAllProblems, createProblem };
