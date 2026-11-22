import prisma from "../prisma/client.js";

const getAllcategory = async () => {
  return await prisma.categoria.findMany({
    include: {
      departamento: true,
    },
  });
};

const createCategory = async (data) => {
  const { tipo_categoria } = data;
  const id_departamento = Number(data?.id_departamento);

  if (!tipo_categoria || !Number.isInteger(id_departamento)) {
    const error = new Error("Indica do nome e o departamento");
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

  const existente = await prisma.categoria.findUnique({
    where: { tipo_categoria },
  });
  if (existente) {
    const error = new Error("Já existe uma categoria com esse nome");
    error.status = 409;
    throw error;
  }

  return prisma.categoria.create({
    data: { tipo_categoria, id_departamento },
    include: { departamento: true },
  });
};

const updateCategory = async (id, data) => {
  const { tipo_categoria } = data;
  const id_departamento = Number(data?.id_departamento);

  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  if (!tipo_categoria || !Number.isInteger(id_departamento)) {
    const error = new Error("Indica do nome e o departamento");
    error.status = 400;
    throw error;
  }

  const existeDepartamento = await prisma.departamento.findUnique({
    where: { id_departamento },
  });

  if (!existeDepartamento) {
    const error = new Error("Departamento invalido");
    error.status = 400;
    throw error;
  }
  const existe = await prisma.categoria.findUnique({
    where: { id_categoria: id },
  });

  if (!existe) {
    const error = new Error("Identificador Invalido");
    error.status = 400;
    throw error;
  }

  return prisma.categoria.update({
    where: { id_categoria: id },
    data: { tipo_categoria, id_departamento },
    include: { departamento: true },
  });
};

export { getAllcategory, createCategory, updateCategory };
