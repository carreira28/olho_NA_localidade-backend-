import * as categoriaServices from "../services/categoriaServices.js";

const getAllcategory = async (req, res, next) => {
  try {
    const category = await categoriaServices.getAllcategory();
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

export { getAllcategory };
