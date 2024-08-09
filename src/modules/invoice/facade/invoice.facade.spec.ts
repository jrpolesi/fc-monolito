import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import { AddressModel } from "../repository/address.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel, AddressModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 1.5,
        },
      ],
    };

    const output = await invoiceFacade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.total).toBe(1.5);
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice",
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
        include: [
          {
            model: InvoiceItemModel,
          },
          {
            model: AddressModel,
          },
        ],
      }
    );

    const input = {
      id: invoice.id,
    };

    const output = await invoiceFacade.find(input);

    expect(output.id).toBe(invoice.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.total).toBe(1.5);
    expect(output.createdAt).toStrictEqual(invoice.createdAt);

    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipCode).toBe(invoice.address.zipCode);

    expect(output.items.length).toBe(1);
    expect(output.items[0].id).toBe(invoice.items[0].id);
    expect(output.items[0].name).toBe(invoice.items[0].name);
    expect(output.items[0].price).toBe(invoice.items[0].price);
  });
});
