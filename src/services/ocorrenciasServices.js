import prisma from "../prisma/client";

const createProblem = async (data, file) => {
  const {
    descricao,
    gravidade,
    latitude,
    longitude,
    id_categoria,
    id_cidadao,
  } = data ?? {};

  if (!descricao || !gravidade || !id_categoria) {
    const error = new Error("");
    error.status = 400;
    throw error;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    const error = new Error("Localização invalida");
    error.status = 400;
    throw error;
  }
};
