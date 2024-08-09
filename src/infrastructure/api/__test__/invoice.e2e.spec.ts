import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { AddressModel } from "../../../modules/invoice/repository/address.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { app } from "../express";

describe("E2E test for invoice", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([AddressModel, InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should get an invoice", async () => {
    const invoiceDb = await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice 1",
        document: "123456789",
        address: {
          street: "Rua 1",
          number: "123",
          complement: "Casa",
          city: "São Paulo",
          state: "SP",
          zipCode: "12345678",
        },
        items: [
          {
            id: "1",
            name: "Item 1",
            price: 1.5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemModel }, { model: AddressModel }],
      }
    );

    const response = await request(app).get(`/invoice/${invoiceDb.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: invoiceDb.id,
      name: invoiceDb.name,
      document: invoiceDb.document,
      address: {
        street: invoiceDb.address.street,
        number: invoiceDb.address.number,
        complement: invoiceDb.address.complement,
        city: invoiceDb.address.city,
        state: invoiceDb.address.state,
        zipCode: invoiceDb.address.zipCode,
      },
      items: [
        {
          id: invoiceDb.items[0].id,
          name: invoiceDb.items[0].name,
          price: invoiceDb.items[0].price,
        },
      ],
      total: 1.5,
      createdAt: invoiceDb.createdAt.toISOString(),
    });
  });
});
