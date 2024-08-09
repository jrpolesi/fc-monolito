import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { ProductModel as ProductAdmModel } from "../../../modules/product-adm/repository/product.model";
import { ProductModel as ProductStorageModel } from "../../../modules/store-catalog/repository/product.model";
import { migrator } from "../../db/sequelize/config-migrations/migrator";
import { app } from "../express";

describe("E2E test for product", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ProductAdmModel, ProductStorageModel]);
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

  it("should create a product", async () => {
    const body = {
      name: "Product 1",
      description: "Description of product 1",
      purchasePrice: 100,
      stock: 10,
    };

    const response = await request(app).post("/products").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: body.name,
      description: body.description,
      purchasePrice: body.purchasePrice,
      stock: body.stock,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
