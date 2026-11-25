import prisma from "../prisma/client.js";

const getAllDepartments = async () => {
  return await prisma.departamento.findMany();
};

const createDepartments = async (data) => {
  const { nome_departamento } = data;

  if (!nome_departamento) {
    const error = new Error("Introduza o nome do departamento");
    error.status = 400;
    throw error;
  }

  const ExisteDepartamento = await prisma.departamento.findUnique({
    where: { nome_departamento },
  });

  if (ExisteDepartamento) {
    const error = new Error("Departamento ja existe");
    error.status = 400;
    throw error;
  }

  return prisma.departamento.create({
    data: { nome_departamento },
  });
};
export { getAllDepartments, createDepartments };
