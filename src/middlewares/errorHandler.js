const notFound = (req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Erro interno do servidor" });
};

export { notFound, errorHandler };
