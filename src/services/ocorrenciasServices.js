import prisma from "../prisma/client.js";

//cidadão
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

//cidadão
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

//cidadão
const createProblem = async (data, files, idCidadao) => {
  const { descricao } = data ?? {};
  const id_categoria = Number(data?.id_categoria);
  const gravidade = data?.gravidade === true || data?.gravidade === "true";

  const semValor = (v) => v === undefined || v === null || v === "";
  const latitude = semValor(data?.latitude) ? NaN : Number(data.latitude);
  const longitude = semValor(data?.longitude) ? NaN : Number(data.longitude);

  if (!descricao || !id_categoria) {
    const error = new Error("Indica a descrição e a categoria");
    error.status = 400;
    throw error;
  }

  const temLocalizacao = !Number.isNaN(latitude) || !Number.isNaN(longitude);

  if (temLocalizacao) {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      const error = new Error("Localização invalida");
      error.status = 400;
      throw error;
    }
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
    error.status = 500;
    throw error;
  }

  const fotos = (files ?? []).map((f) => ({ foto: f.path }));

  return prisma.problema.create({
    data: {
      descricao: descricao.trim(),
      gravidade,
      latitude: temLocalizacao ? latitude : null,
      longitude: temLocalizacao ? longitude : null,
      id_cidadao: idCidadao,
      id_categoria,
      id_departamento: categoria.id_departamento,
      fotos: { create: fotos },
      historicoEstados: { create: { id_estado: estado.id_estado } },
    },
    include: { fotos: true, categoria: true },
  });
};
/*id_cidadao romovido para que o admin e o cidadao possam alterar a localização */
const setLocation = async (id, data) => {
  const semValor = (v) => v === undefined || v === null || v === "";
  const latitude = semValor(data?.latitude) ? NaN : Number(data.latitude);
  const longitude = semValor(data?.longitude) ? NaN : Number(data.longitude);

  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    const error = new Error("Localização invalida");
    error.status = 400;
    throw error;
  }

  const problema = await prisma.problema.findFirst({
    where: { id_problema: id },
  });

  if (!problema) {
    const error = new Error("Ocorrência não encontrada");
    error.status = 404;
    throw error;
  }

  if (problema.latitude !== null) {
    const error = new Error("Ocorrência já tem localização");
    error.status = 409;
    throw error;
  }

  return prisma.problema.update({
    where: { id_problema: id },
    data: { latitude, longitude },
    select: { id_problema: true, latitude: true, longitude: true },
  });
};

const getPriorities = async () =>
  prisma.prioridade.findMany({ orderBy: { id_prioridade: "asc" } });

const getProblemForManagement = async (id, user) => {
  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  const where = { id_problema: id };
  if (user.perfil?.toUpperCase() !== "ADMINISTRADOR") {
    where.id_departamento = user.departamento;
  }

  const problema = await prisma.problema.findFirst({
    where,
    include: {
      cidadao: { select: { nome: true, email: true } },
      fotos: true,
      categoria: true,
      prioridade: true,
      departamento: true,
      historicoEstados: {
        include: {
          estado: { include: { tipo: true } },
          funcionario: { select: { nome: true } },
        },
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

//!não verificado
const getProblemsForManagement = async (user) => {
  const eAdmin = user.perfil?.toUpperCase() === "ADMINISTRADOR";
  const where = {};

  if (!eAdmin) {
    if (!user.departamento) {
      const error = new Error("Funcionário sem departamento atribuído");
      error.status = 404;
      throw error;
    }
    where.id_departamento = user.departamento;
    where.historicoEstados = { some: { estado: { nome_estado: "VALIDADA" } } };
  }

  return prisma.problema.findMany({
    where,
    include: {
      categoria: true,
      prioridade: true,
      ...incluirHistorico,
    },
    orderBy: { data_criacao: "desc" },
  });
};

const currentState = (historico, tipo) =>
  historico.find((h) => h.estado.tipo.nome_tipo === tipo)?.estado.nome_estado ??
  null;

const incluirHistorico = {
  historicoEstados: {
    include: { estado: { include: { tipo: true } } },
    orderBy: [{ data_hora: "desc" }, { id_historicoEstados: "desc" }],
  },
};

const validateProblem = async (id, data, idFuncionario) => {
  const id_categoria = Number(data?.id_categoria);
  const id_prioridade = Number(data?.id_prioridade);

  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }
  if (!Number.isInteger(id_categoria)) {
    const error = new Error("Indica a categoria");
    error.status = 400;
    throw error;
  }
  if (!Number.isInteger(id_prioridade)) {
    const error = new Error("Indica a prioridade");
    error.status = 400;
    throw error;
  }

  return prisma.$transaction(
    async (tx) => {
      const problema = await tx.problema.findUnique({
        where: { id_problema: id },
        include: incluirHistorico,
      });
      if (!problema) {
        const error = new Error("Ocorrência não encontrada");
        error.status = 404;
        throw error;
      }

      const validacao = currentState(problema.historicoEstados, "VALIDACAO");
      if (validacao?.toUpperCase() !== "PENDENTE") {
        const error = new Error("A ocorrência já foi validada ou rejeitada");
        error.status = 409;
        throw error;
      }

      const categoria = await tx.categoria.findUnique({
        where: { id_categoria },
      });
      if (!categoria) {
        const error = new Error("Categoria inválida");
        error.status = 400;
        throw error;
      }

      const prioridade = await tx.prioridade.findUnique({
        where: { id_prioridade },
      });
      if (!prioridade) {
        const error = new Error("Prioridade inválida");
        error.status = 400;
        throw error;
      }

      const estado = await tx.estado.findUnique({
        where: { nome_estado: "VALIDADA" },
      });
      if (!estado) {
        const error = new Error("Estado inválido");
        error.status = 500;
        throw error;
      }

      return tx.problema.update({
        where: { id_problema: id },
        data: {
          id_categoria,
          id_prioridade,
          id_departamento: categoria.id_departamento,
          historicoEstados: {
            create: {
              id_estado: estado.id_estado,
              id_funcionarioMunicipal: idFuncionario,
              id_departamento: categoria.id_departamento,
            },
          },
        },
        include: { categoria: true, prioridade: true },
      });
    },
    { isolationLevel: "Serializable" },
  );
};

const rejectProblem = async (id, idFuncionario) => {
  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  return prisma.$transaction(
    async (tx) => {
      const problema = await tx.problema.findUnique({
        where: { id_problema: id },
        include: incluirHistorico,
      });

      if (!problema) {
        const error = new Error("Ocorrência não encontrada");
        error.status = 404;
        throw error;
      }

      const validacao = currentState(problema.historicoEstados, "VALIDACAO");
      if (validacao?.toUpperCase() !== "PENDENTE") {
        const error = new Error("A ocorrência já foi validada ou rejeitada");
        error.status = 409;
        throw error;
      }

      const estado = await tx.estado.findUnique({
        where: { nome_estado: "REJEITADA" },
      });
      if (!estado) {
        const error = new Error("Estado Invalido");
        error.status = 400;
        throw error;
      }

      await tx.historicoEstados.create({
        data: {
          id_problema: id,
          id_estado: estado.id_estado,
          id_funcionarioMunicipal: idFuncionario,
        },
      });

      return { id_problema: id, validacao: "REJEITADA" };
    },
    { isolationLevel: "Serializable" },
  );
};

export {
  getAllProblems,
  getProblem,
  getProblemsForManagement,
  getCategorias,
  createProblem,
  setLocation,
  getProblemForManagement,
  validateProblem,
  rejectProblem,
  getPriorities,
};
