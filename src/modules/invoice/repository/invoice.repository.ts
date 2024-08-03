import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";

import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { AddressModel } from "./address.model";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        address: {
          street: invoice.address.street,
          number: invoice.address.number,
          complement: invoice.address.complement,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zipCode,
        },
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      { include: [{ model: InvoiceItemModel }, { model: AddressModel }] }
    );
  }
  async find(id: string): Promise<Invoice> {
    const invoiceDb = await InvoiceModel.findOne({
      where: {
        id,
      },
      include: [{ model: InvoiceItemModel }, { model: AddressModel }],
    });

    const address = new Address(
      invoiceDb.address.street,
      invoiceDb.address.number,
      invoiceDb.address.complement,
      invoiceDb.address.city,
      invoiceDb.address.state,
      invoiceDb.address.zipCode
    );

    const items = invoiceDb.items.map(
      (item) =>
        new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
    );

    return new Invoice({
      id: new Id(invoiceDb.id),
      name: invoiceDb.name,
      document: invoiceDb.document,
      address,
      items,
      createdAt: invoiceDb.createdAt,
      updatedAt: invoiceDb.updatedAt,
    });
  }
}
