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

export const signup = async (data) => {
  const { nome, password } = data ?? {};
  const email = data?.email?.trim().toLowerCase();

  if (!nome || !email || typeof password !== "string" || password.length < 8) {
    const error = new Error(
      "Indica nome, email e password (mín. 8 caracteres)",
    );
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
