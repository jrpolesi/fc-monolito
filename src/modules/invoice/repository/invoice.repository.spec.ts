import { Sequelize } from "sequelize-typescript";
import { AddressModel } from "./address.model";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import Address from "../../@shared/domain/value-object/address";

describe("InvoiceRepository test", () => {
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

  it("Should create an invoice", async () => {
    const addressProps = {
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
    };
    const address = new Address(
      addressProps.street,
      addressProps.number,
      addressProps.complement,
      addressProps.city,
      addressProps.state,
      addressProps.zipCode
    );

    const invoiceItemProps1 = {
      name: "Invoice Item 1",
      price: 1.5,
    };
    const invoice1 = new InvoiceItem(invoiceItemProps1);

    const invoiceItemProps2 = {
      name: "Invoice Item 2",
      price: 2.5,
    };
    const invoice2 = new InvoiceItem(invoiceItemProps2);

    const invoiceProps = {
      name: "Invoice 1",
      document: "Document 1",
      address,
      items: [invoice1, invoice2],
    };
    const invoice = new Invoice(invoiceProps);

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.save(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: {
        id: invoice.id.id,
      },
      include: [{ model: InvoiceItemModel }, { model: AddressModel }],
    });

    expect(invoiceDb).toBeDefined();

    expect(invoiceDb.id).toBe(invoice.id.id);
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt);

    expect(invoiceDb.address.id).toBeDefined();
    expect(invoiceDb.address.street).toBe(address.street);
    expect(invoiceDb.address.number).toBe(address.number);
    expect(invoiceDb.address.complement).toBe(address.complement);
    expect(invoiceDb.address.city).toBe(address.city);
    expect(invoiceDb.address.state).toBe(address.state);
    expect(invoiceDb.address.zipCode).toBe(address.zipCode);

    expect(invoiceDb.items).toMatchObject([
      {
        id: invoice1.id.id,
        name: invoice1.name,
        price: invoice1.price,
        createdAt: invoice1.createdAt,
        updatedAt: invoice1.updatedAt,
      },
      {
        id: invoice2.id.id,
        name: invoice2.name,
        price: invoice2.price,
        createdAt: invoice2.createdAt,
        updatedAt: invoice2.updatedAt,
      },
    ]);
  });

  it("Should find an invoice", async () => {
    const invoiceDb = {
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: {
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
      },
      items: [
        {
          id: "1",
          name: "Invoice Item 1",
          price: 1.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    await InvoiceModel.create(invoiceDb, {
      include: [{ model: InvoiceItemModel }, { model: AddressModel }],
    });

    const invoiceRepository = new InvoiceRepository();
    const invoice = await invoiceRepository.find(invoiceDb.id);

    expect(invoice).toBeDefined();
    expect(invoice.id.id).toBe(invoiceDb.id);
    expect(invoice.name).toBe(invoiceDb.name);
    expect(invoice.document).toBe(invoiceDb.document);
    expect(invoice.createdAt).toStrictEqual(invoiceDb.createdAt);
    expect(invoice.updatedAt).toStrictEqual(invoiceDb.updatedAt);

    expect(invoice.address.street).toBe(invoiceDb.address.street);
    expect(invoice.address.number).toBe(invoiceDb.address.number);
    expect(invoice.address.complement).toBe(invoiceDb.address.complement);
    expect(invoice.address.city).toBe(invoiceDb.address.city);
    expect(invoice.address.state).toBe(invoiceDb.address.state);
    expect(invoice.address.zipCode).toBe(invoiceDb.address.zipCode);

    expect(invoice.items[0].id.id).toBe(invoiceDb.items[0].id);
    expect(invoice.items[0].name).toBe(invoiceDb.items[0].name);
    expect(invoice.items[0].price).toBe(invoiceDb.items[0].price);
    expect(invoice.items[0].createdAt).toStrictEqual(
      invoiceDb.items[0].createdAt
    );
    expect(invoice.items[0].updatedAt).toStrictEqual(
      invoiceDb.items[0].updatedAt
    );
  });
});
