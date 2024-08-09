import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { app } from "../express";

describe("E2E test for client", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const body = {
      name: "Client 1",
      document: "123456789",
      email: "any_email@example.com",
      street: "any_street",
      number: 123,
      complement: "any_complement",
      city: "any_city",
      state: "any_state",
      zipCode: "12345678",
    };

    const response = await request(app).post("/clients").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: body.name,
      document: body.document,
      email: body.email,
      address: {
        street: body.street,
        number: body.number,
        complement: body.complement,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
