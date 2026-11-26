import * as utilizadoresServices from "../services/utilizadoresServices.js";

const getAllAccounts = async (req, res, next) => {
  try {
    const contas = await utilizadoresServices.getAllAccounts();

    return res.status(200).json(contas);
  } catch (err) {
    next(err);
  }
};

const getEmployeeHistory = async (req, res, next) => {
  try {
    const historico = await utilizadoresServices.getEmployeeHistory(
      Number(req.params.id),
    );

    return res.status(200).json(historico);
  } catch (err) {
    next(err);
  }
};

const getCitizenHistory = async (req, res, next) => {
  try {
    const historico = await utilizadoresServices.getCitizenHistory(
      Number(req.params.id),
    );

    return res.status(200).json(historico);
  } catch (err) {
    next(err);
  }
};

export { getAllAccounts, getEmployeeHistory, getCitizenHistory };
