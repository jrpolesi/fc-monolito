import express, { Request, Response } from "express";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const clientRepository = new ClientRepository();
  const addClientUseCase = new AddClientUseCase(clientRepository);

  const input = {
    name: req.body.name,
    email: req.body.email,
    document: req.body.document,
    address: {
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    },
  };

  const output = await addClientUseCase.execute(input);

  return res.status(201).json(output);
});
