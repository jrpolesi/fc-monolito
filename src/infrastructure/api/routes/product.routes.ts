import express, { Request, Response } from "express";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const productRepository = new ProductRepository();
  const productAdmUseCase = new AddProductUseCase(productRepository);

  const input = {
    name: req.body.name,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    stock: req.body.stock,
  };

  const output = await productAdmUseCase.execute(input);

  return res.status(201).json(output);
});
