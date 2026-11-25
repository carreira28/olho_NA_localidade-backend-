import prisma from "../prisma/client.js";

const getAllDepartamentes = async () => {
  return await prisma.departamento.findMany({
    include: {
      categorias: true,
    },
  });
};

export { getAllDepartamentes };
