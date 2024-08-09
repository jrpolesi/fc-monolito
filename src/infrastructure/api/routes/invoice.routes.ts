import express, { Request, Response } from "express";
import FindInvoiceUseCase from "../../../modules/invoice/usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const invoiceRepository = new InvoiceRepository();
  const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

  const input = {
    id: req.params.id,
  };

  const output = await findInvoiceUseCase.execute(input);

  res.status(200).json(output);
});
