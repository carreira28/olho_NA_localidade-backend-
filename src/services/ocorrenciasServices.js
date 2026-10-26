import prisma from "../prisma/client.js";

const getAllProblems = async (idCidadao) => {
  return await prisma.problema.findMany({
    where: { id_cidadao: idCidadao },
    include: {
      fotos: true,
      categoria: true,
      historicoEstados: {
        include: { estado: { include: { tipo: true } } },
        orderBy: { data_hora: "desc" },
      },
    },
    orderBy: { data_criacao: "desc" },
  });
};

const getProblem = async (idCidadao, id) => {
  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  const problema = await prisma.problema.findFirst({
    where: { id_problema: id, id_cidadao: idCidadao },
    include: {
      fotos: true,
      categoria: true,
      historicoEstados: {
        include: { estado: { include: { tipo: true } } },
        orderBy: [{ data_hora: "desc" }, { id_historicoEstados: "desc" }],
      },
    },
  });

  if (!problema) {
    const error = new Error("Ocorrência não encontrada");
    error.status = 404;
    throw error;
  }

  return problema;
};

const getCategorias = async () => {
  return prisma.categoria.findMany({
    select: { id_categoria: true, tipo_categoria: true },
    orderBy: { tipo_categoria: "asc" },
  });
};

const createProblem = async (data, file, idCidadao) => {
  const { descricao } = data ?? {};
  const id_categoria = Number(data?.id_categoria);
  const gravidade = data?.gravidade === true || data?.gravidade === "true";

  const semValor = (v) => v === undefined || v === null || v === "";
  const latitude = semValor(data?.latitude) ? null : Number(data.latitude);
  const longitude = semValor(data?.longitude) ? null : Number(data.longitude);

  if (!descricao || !id_categoria) {
    const error = new Error("Indica a descrição e a categoria");
    error.status = 400;
    throw error;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    const error = new Error("Localização invalida");
    error.status = 400;
    throw error;
  }

  const categoria = await prisma.categoria.findUnique({
    where: { id_categoria },
  });

  if (!categoria) {
    const error = new Error("Catgoria invalida");
    error.status = 400;
    throw error;
  }

  const estado = await prisma.estado.findUnique({
    where: { nome_estado: "PENDENTE" },
  });

  if (!estado) {
    const error = new Error("Estado invalido");
    error.status = 400;
    throw error;
  }

  const fotos = (file ?? []).map((f) => ({ foto: f.path }));

  return prisma.problema.create({
    data: {
      descricao: descricao.trim(),
      gravidade,
      latitude,
      longitude,
      id_cidadao: idCidadao,
      id_categoria,
      id_departamento: categoria.id_departamento,
      fotos: { create: fotos },
      historicoEstados: { create: { id_estado: estado.id_estado } },
    },
    include: { fotos: true, categoria: true },
  });
};

export { getAllProblems, getProblem, getCategorias, createProblem };
