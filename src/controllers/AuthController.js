import * as AuthServices from "../services/authServices.js";

const responderErro = (err, res, next) => {
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }
  next(err);
};

const signup = async (req, res, next) => {
  try {
    const resultado = await AuthServices.signup(req.body);
    return res.status(201).json(resultado);
  } catch (err) {
    responderErro(err, res, next);
  }
};

const signin = async (req, res, next) => {
  try {
    const resultado = await AuthServices.signin(req.body);
    return res.status(200).json(resultado);
  } catch (err) {
    responderErro(err, res, next);
  }
};

const criarFuncionario = async (req, res, next) => {
  try {
    const funcionario = await AuthServices.criarFuncionario(
      req.body,
      req.user.id,
    );
    return res.status(201).json(funcionario);
  } catch (err) {
    responderErro(err, res, next);
  }
};

//quem sou eu (cidadão , admin, funcionario)
const me = (req, res) => res.status(200).json(req.user);

export { signup, signin, criarFuncionario, me };
