import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const obterEstadoAtivo = async () => {
  const estado = await prisma.estadoConta.findUnique({
    where: { tipo_estado_conta: "ATIVO" },
  });

  if (!estado) {
    const error = new Error(
      'Estado de conta "Ativa" não existe. Corre o seed.',
    );
    error.status = 500;
    throw error;
  }
  return estado;
};

const emailEmUso = async (email) => {
  const [cidadao, funcionario] = await Promise.all([
    prisma.cidadao.findUnique({
      where: { email },
      select: { id_cidadao: true },
    }),
    prisma.funcionarioMunicipal.findUnique({
      where: { email },
      select: { id_funcionarioMunicipal: true },
    }),
  ]);
  return Boolean(cidadao || funcionario);
};

const signup = async (data) => {
  const { nome, email, password } = data ?? {};

  if (!email || !password || !nome) {
    const error = new Error("Indica o nome, email e password");
    error.status = 400;
    throw error;
  }

  if (await emailEmUso(email)) {
    const error = new Error("Email já registado");
    error.status = 409;
    throw error;
  }

  const ativo = await obterEstadoAtivo();
  const hashedPassword = await bcrypt.hash(password, 10);

  const cidadao = await prisma.cidadao.create({
    data: {
      nome: nome.trim(),
      email,
      password: hashedPassword,
      id_estado_conta: ativo.id_estado_conta,
      historico: { create: { id_estado_conta: ativo.id_estado_conta } },
    },
  });

  return { id: cidadao.id_cidadao, nome: cidadao.nome, email: cidadao.email };
};

const criarFuncionario = async (data, idAdmin) => {
  const { nome, email, password, id_departamento } = data ?? {};

  if (!email || !password || !nome || !id_departamento) {
    const error = new Error("Indica o nome, email, password e o departamento");
    error.status = 400;
    throw error;
  }

  const departamento = await prisma.departamento.findUnique({
    where: { id_departamento },
  });

  if (!departamento) {
    const error = new Error("Departamento inválido");
    error.status = 400;
    throw error;
  }

  const perfil = await prisma.perfil.findUnique({
    where: { tipo_utilizador: "FUNCIONARIO MUNICIPAL" },
  });

  if (!perfil) {
    const error = new Error("Perfil não existe.");
    error.status = 500;
    throw error;
  }

  if (await emailEmUso(email)) {
    const error = new Error("Email já registado");
    error.status = 409;
    throw error;
  }

  const ativo = await obterEstadoAtivo();
  const hashedPassword = await bcrypt.hash(password, 10);

  const funcionario = await prisma.funcionarioMunicipal.create({
    data: {
      nome: nome,
      email,
      password: hashedPassword,
      id_perfil: perfil.id_perfil,
      id_departamento,
      id_estado_conta: ativo.id_estado_conta,
      historicoComoFuncionario: {
        create: { id_estado_conta: ativo.id_estado_conta, id_admin: idAdmin },
      },
    },
  });

  return {
    id: funcionario.id_funcionarioMunicipal,
    nome: funcionario.nome,
    email: funcionario.email,
  };
};

const signin = async (data) => {
  const { email, password } = data ?? {};

  if (!email) {
    const error = new Error("Indica o email");
    error.status = 400;
    throw error;
  }

  const cidadao = await prisma.cidadao.findUnique({
    where: { email },
    include: { estadoConta: true },
  });

  const funcionario = cidadao
    ? null
    : await prisma.funcionarioMunicipal.findUnique({
        where: { email },
        include: { estadoConta: true, perfil: true },
      });

  const conta = cidadao ?? funcionario;

  if (!conta) {
    const error = new Error("Email ou password incorretos");
    error.status = 401;
    throw error;
  }

  const validarPassword = await bcrypt.compare(password, conta.password);

  if (!validarPassword) {
    const error = new Error("Email ou password incorretos");
    error.status = 401;
    throw error;
  }

  if (conta.estadoConta.tipo_estado_conta !== "ATIVO") {
    const error = new Error("A conta não está ativa");
    error.status = 403;
    throw error;
  }

  const utilizador = cidadao
    ? {
        id: cidadao.id_cidadao,
        nome: cidadao.nome,
        email: cidadao.email,
        tipo: "cidadao",
      }
    : {
        id: funcionario.id_funcionarioMunicipal,
        nome: funcionario.nome,
        email: funcionario.email,
        tipo: "funcionario",
        perfil: funcionario.perfil.tipo_utilizador,
        departamento: funcionario.id_departamento,
      };

  const token = jwt.sign(
    {
      id: utilizador.id,
      tipo: utilizador.tipo,
      perfil: utilizador.perfil,
      departamento: utilizador.departamento,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token, utilizador };
};

export { signin, signup, criarFuncionario };
