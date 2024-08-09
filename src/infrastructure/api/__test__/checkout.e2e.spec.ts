import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { ProductModel as ProductAdmModel } from "../../../modules/product-adm/repository/product.model";
import { ProductModel as ProductStorageModel } from "../../../modules/store-catalog/repository/product.model";
import { migrator } from "../../db/sequelize/config-migrations/migrator";
import { app } from "../express";
import { ClientModel as ClientAdmModel } from "../../../modules/client-adm/repository/client.model";
import ClientCheckoutModel from "../../../modules/checkout/repository/client.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { AddressModel } from "../../../modules/invoice/repository/address.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import {
  OrderModel,
  OrdersProductsModel,
  ProductModel as ProductCheckoutModel,
} from "../../../modules/checkout/repository/order.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";

describe("E2E test for checkout", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([
      ClientAdmModel,
      ClientCheckoutModel,
      ProductAdmModel,
      ProductStorageModel,
      TransactionModel,
      InvoiceItemModel,
      AddressModel,
      InvoiceModel,
      OrderModel,
      ProductCheckoutModel,
      OrdersProductsModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterAll(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a checkout", async () => {
    const client = await ClientAdmModel.create({
      id: "1",
      name: "Client 1",
      document: "123456789",
      email: "test@example.com",
      street: "any_street",
      number: 123,
      complement: "any_complement",
      city: "any_city",
      state: "any_state",
      zipcode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product1 = await ProductAdmModel.create({
      id: "1",
      name: "Product 1",
      description: "Description of product 1",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductStorageModel.update(
      { salesPrice: product1.purchasePrice + 20 },
      { where: { id: product1.id } }
    );

    const product2 = await ProductAdmModel.create({
      id: "2",
      name: "Product 2",
      description: "Description of product 2",
      purchasePrice: 200,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductStorageModel.update(
      { salesPrice: product2.purchasePrice + 20 },
      { where: { id: product2.id } }
    );

    const body = {
      clientId: client.id,
      products: [{ productId: product1.id }, { productId: product2.id }],
    };

    const response = await request(app).post("/checkout").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      invoiceId: expect.any(String),
      status: "approved",
      total: 340,
      products: [{ productId: product1.id }, { productId: product2.id }],
    });
  });
});
