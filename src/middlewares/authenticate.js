import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }
    req.user = user;
    next();
  });
};

const apenasCidadao = (req, res, next) => {
  if (req.user?.tipo !== "cidadao") {
    return res.status(403).json({ message: "Acesso reservado a cidadãos" });
  }
  next();
};

const requirePerfil = (...perfis) => {
  const permitidos = perfis.map((p) => p.toLowerCase());

  return (req, res, next) => {
    const perfil = req.user?.perfil?.toLowerCase();

    if (req.user?.tipo !== "funcionario" || !permitidos.includes(perfil)) {
      return res.status(403).json({ message: "Sem permissões para esta ação" });
    }
    next();
  };
};

export { authenticateToken, apenasCidadao, requirePerfil };
