import * as utilizadoresServices from "../services/utilizadoresServices.js";

const getAllAccounts = async (req, res, next) => {
  try {
    const getAllAccounts = await utilizadoresServices.getAllAccounts();
  } catch (err) {
    next(err);
  }
};

const getEmployeeHistory = async (req, res, next) => {
  try {
    const getEmployeeHistory = await utilizadoresServices.getEmployeeHistory(
      Number(req.params.id),
    );
  } catch (err) {
    next(err);
  }
};

const getCitizenHistory = async (req, res, next) => {
  try {
    const getCitizenHistory = await utilizadoresServices.getCitizenHistory(
      Number(req.params.id),
    );
  } catch (err) {
    next(err);
  }
};

export { getAllAccounts, getEmployeeHistory, getCitizenHistory };
