import prisma from "../prisma/client.js";

const getAllcategory = async () => {
  return await prisma.categoria.findMany({
    include: {
      departamento: true,
    },
  });
};

export { getAllcategory };
