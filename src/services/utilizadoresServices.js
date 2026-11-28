import prisma from "../prisma/client.js";

const getAllAccounts = async () => {
  const [cidadaos, funcionarios] = await Promise.all([
    prisma.cidadao.findMany({
      include: {
        estadoConta: true,
      },
    }),

    prisma.funcionarioMunicipal.findMany({
      include: {
        estadoConta: true,
        perfil: true,
        departamento: true,
      },
    }),
  ]);

  return {
    cidadaos,
    funcionarios,
  };
};

const getCitizenHistory = async (id) => {
  return prisma.historicoEstadoCidadao.findMany({
    where: {
      id_cidadao: id,
    },
    include: {
      estadoConta: true,
      admin: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: {
      data_hora: "desc",
    },
  });
};

const getEmployeeHistory = async (id) => {
  return prisma.historicoEstadoFuncionario.findMany({
    where: {
      id_funcionarioMunicipal: id,
    },
    include: {
      estadoConta: true,
      admin: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: {
      data_hora: "desc",
    },
  });
};

const UpdateUserAccount = async (id, tipo, data, idAdmin) => {
  const { nome, email } = data;
  const id_departamento = Number(data?.id_departamento);
  const id_estado_conta = Number(data?.id_estado_conta);

  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  if (!nome || !email || !Number.isInteger(id_estado_conta)) {
    const error = new Error("Indica o nome, o email e o estado da conta");
    error.status = 400;
    throw error;
  }

  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }
};

export { getAllAccounts, getEmployeeHistory, getCitizenHistory };
