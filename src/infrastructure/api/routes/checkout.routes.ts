import express, { Request, Response } from "express";
import CheckoutRepository from "../../../modules/checkout/repository/checkout.repository";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const checkoutRepository = new CheckoutRepository();

  const placeOrderUseCase = new PlaceOrderUseCase(
    ClientAdmFacadeFactory.create(),
    ProductAdmFacadeFactory.create(),
    StoreCatalogFacadeFactory.create(),
    PaymentFacadeFactory.create(),
    InvoiceFacadeFactory.create(),
    checkoutRepository
  );

  const input = {
    clientId: req.body.clientId,
    products: req.body.products,
  };

  const output = await placeOrderUseCase.execute(input);

  return res.status(201).json(output);
});
