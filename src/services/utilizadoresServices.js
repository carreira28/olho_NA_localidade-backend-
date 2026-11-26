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

export { getAllAccounts, getEmployeeHistory, getCitizenHistory };
