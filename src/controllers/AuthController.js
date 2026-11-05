import * as AuthServices from "../services/authServices.js";

const signup = async (req, res, next) => {
  try {
    const resultado = await AuthServices.signup(req.body);
    return res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const resultado = await AuthServices.signin(req.body);
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const funcionario = await AuthServices.createEmployee(
      req.body,
      req.user.id,
    );
    return res.status(201).json(funcionario);
  } catch (err) {
    next(err);
  }
};

//quem sou eu (cidadão , admin, funcionario)
const me = (req, res) => res.status(200).json(req.user);

export { signup, signin, createEmployee, me };
