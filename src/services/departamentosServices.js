import prisma from "../prisma/client.js";

const getAllDepartments = async () => {
  return await prisma.departamento.findMany();
};

const createDepartments = async (data) => {
  const { nome_departamento, categorias } = data;

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

//!testar melhor depois
const updateDepartments = async (id, data) => {
  const { nome_departamento } = data;
  const categorias = data?.categorias;

  if (!Number.isInteger(id)) {
    const error = new Error("Identificador inválido");
    error.status = 400;
    throw error;
  }

  if (!nome_departamento) {
    const error = new Error("Introduza o nome do departamento");
    error.status = 400;
    throw error;
  }

  const departamento = await prisma.departamento.findUnique({
    where: { id_departamento: id },
  });

  if (!departamento) {
    const error = new Error("Departamento não encontrado");
    error.status = 404;
    throw error;
  }

  const existente = await prisma.departamento.findUnique({
    where: { nome_departamento },
  });

  if (existente && existente.id_departamento !== id) {
    const error = new Error("Já existe um departamento com esse nome");
    error.status = 409;
    throw error;
  }

  let idsCategorias = [];

  if (categorias !== undefined) {
    if (!Array.isArray(categorias)) {
      const error = new Error("Categorias inválidas");
      error.status = 400;
      throw error;
    }

    idsCategorias = [...new Set(categorias.map(Number))];

    if (!idsCategorias.every(Number.isInteger)) {
      const error = new Error("Identificadores de categorias inválidos");
      error.status = 400;
      throw error;
    }

    const encontradas = await prisma.categoria.findMany({
      where: { id_categoria: { in: idsCategorias } },
    });

    if (encontradas.length !== idsCategorias.length) {
      const error = new Error("Uma ou mais categorias não existem");
      error.status = 400;
      throw error;
    }

    const ocupadas = encontradas.filter((c) => c.id_departamento !== id);

    if (ocupadas.length > 0) {
      const error = new Error(
        "Uma ou mais categorias já estão associadas a outro departamento",
      );
      error.status = 409;
      throw error;
    }
  }

  await prisma.$transaction([
    prisma.departamento.update({
      where: { id_departamento: id },
      data: { nome_departamento },
    }),
    prisma.categoria.updateMany({
      where: { id_categoria: { in: idsCategorias } },
      data: { id_departamento: id },
    }),
  ]);

  return prisma.departamento.findUnique({
    where: { id_departamento: id },
    include: {
      categorias: true,
      funcionarios: {
        select: {
          id_funcionarioMunicipal: true,
          nome: true,
          email: true,
          data_registo: true,
          perfil: true,
          estadoConta: true,
        },
      },
    },
  });
};

export { getAllDepartments, createDepartments, updateDepartments };
