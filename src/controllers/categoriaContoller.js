import * as categoriaServices from "../services/categoriaServices.js";

const getAllcategory = async (req, res, next) => {
  try {
    const category = await categoriaServices.getAllcategory();
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const createCategoria = async (req, res, next) => {
  try {
    const category = await categoriaServices.createCategory(req.body);
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoriaServices.updateCategory(
      Number(req.params.id),
      req.body,
    );
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

export { getAllcategory, createCategoria, updateCategory };
