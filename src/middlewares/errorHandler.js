const notFound = (req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err?.name === "MulterError") {
    return res
      .status(400)
      .json({ message: "Ficheiro inválido (maximo 3 imagens com 4 MB)" });
  }

  if (err?.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor"
        : err.message,
  });
};

export { notFound, errorHandler };
