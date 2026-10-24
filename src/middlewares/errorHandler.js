const notFound = (req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err?.name === "MulterError") {
    return res
      .status(400)
      .json({ message: "Ficheiro inválido (campo, tamanho ou quantidade)" });
  }

  if (err?.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: "Erro interno do servidor" });
};

export { notFound, errorHandler };
