import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import { OrderModel, OrdersProductsModel, ProductModel } from "./order.model";
import ClientModel from "./client.model";

describe("Checkout Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      ProductModel,
      OrderModel,
      ClientModel,
      OrdersProductsModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const address = new Address(
      "Rua 1",
      "123",
      "Casa",
      "São Paulo",
      "SP",
      "12345678"
    );

    const client = new Client({
      name: "Client 1",
      email: "any_email@email.com",
      document: "123456789",
      address: address,
    });

    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      salesPrice: 1.5,
    });

    const order = new Order({
      client,
      products: [product],
      status: "approved",
    });

    const repository = new CheckoutRepository();

    await repository.addOrder(order);

    const orderDb = await OrderModel.findOne({
      where: {
        id: order.id.id,
      },
      include: [
        {
          model: ProductModel,
        },
        {
          model: ClientModel,
        },
      ],
    });

    expect(orderDb).toBeDefined();

    expect(orderDb.id).toEqual(order.id.id);

    expect(orderDb.client.id).toEqual(client.id.id);
    expect(orderDb.client.name).toEqual(client.name);
    expect(orderDb.client.email).toEqual(client.email);
    expect(orderDb.client.document).toEqual(client.document);

    expect(orderDb.client.street).toEqual(client.address.street);
    expect(orderDb.client.number).toEqual(client.address.number);
    expect(orderDb.client.complement).toEqual(client.address.complement);
    expect(orderDb.client.city).toEqual(client.address.city);
    expect(orderDb.client.state).toEqual(client.address.state);
    expect(orderDb.client.zipcode).toEqual(client.address.zipCode);

    expect(orderDb.products.length).toBe(1);
    expect(orderDb.products[0].id).toEqual(product.id.id);
    expect(orderDb.products[0].name).toEqual(product.name);
    expect(orderDb.products[0].description).toEqual(product.description);
    expect(orderDb.products[0].salesPrice).toEqual(product.salesPrice);

    expect(orderDb.status).toEqual(order.status);
  });

  it("should find an order", async () => {
    const orderDb = {
      id: "1",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
      client: {
        id: "1",
        name: "Client 1",
        email: "any_email@example.com",
        document: "123456789",
        street: "Rua 1",
        number: "123",
        complement: "Casa",
        city: "São Paulo",
        state: "SP",
        zipcode: "12345678",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      products: [
        {
          id: "1",
          name: "Product 1",
          description: "Description 1",
          salesPrice: 1.5,
        },
      ],
    };

    await OrderModel.create(orderDb, {
      include: [
        {
          model: ProductModel,
        },
        {
          model: ClientModel,
        },
      ],
    });

    const repository = new CheckoutRepository();

    const order = await repository.findOrder(orderDb.id);

    expect(order).toBeDefined();
    expect(order.id.id).toBe(orderDb.id);
    expect(order.status).toBe(orderDb.status);
    expect(order.createdAt).toStrictEqual(expect.any(Date));
    expect(order.updatedAt).toStrictEqual(expect.any(Date));

    expect(order.client.id.id).toBe(orderDb.client.id);
    expect(order.client.name).toBe(orderDb.client.name);
    expect(order.client.email).toBe(orderDb.client.email);
    expect(order.client.document).toBe(orderDb.client.document);
    expect(order.client.address.street).toBe(orderDb.client.street);
    expect(order.client.address.number).toBe(orderDb.client.number);
    expect(order.client.address.complement).toBe(orderDb.client.complement);
    expect(order.client.address.city).toBe(orderDb.client.city);
    expect(order.client.address.state).toBe(orderDb.client.state);
    expect(order.client.address.zipCode).toBe(orderDb.client.zipcode);

    expect(order.products.length).toBe(1);
    expect(order.products[0].id.id).toBe(orderDb.products[0].id);
    expect(order.products[0].name).toBe(orderDb.products[0].name);
    expect(order.products[0].description).toBe(orderDb.products[0].description);
    expect(order.products[0].salesPrice).toBe(orderDb.products[0].salesPrice);
  });
});
