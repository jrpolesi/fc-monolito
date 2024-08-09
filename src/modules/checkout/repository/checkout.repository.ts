import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel, OrdersProductsModel, ProductModel } from "./order.model";
import ClientModel from "./client.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const clientDb = await ClientModel.findOne({
      where: { id: order.client.id.id },
    });

    const clientIntent = {
      name: order.client.name,
      email: order.client.email,
      document: order.client.document,
      street: order.client.address.street,
      number: order.client.address.number,
      complement: order.client.address.complement,
      city: order.client.address.city,
      state: order.client.address.state,
      zipcode: order.client.address.zipCode,
      createdAt: order.client.createdAt,
      updatedAt: order.client.updatedAt,
    };

    if (clientDb) {
      await ClientModel.update(clientIntent, {
        where: { id: order.client.id.id },
      });
    } else {
      await ClientModel.create({
        id: order.client.id.id,
        ...clientIntent,
      });
    }

    await Promise.all(
      order.products.map(async (product) => {
        const productDb = await ProductModel.findOne({
          where: { id: product.id.id },
        });

        const productIntent = {
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        };

        if (productDb) {
          await ProductModel.update(productIntent, {
            where: { id: product.id.id },
          });
        } else {
          await ProductModel.create({
            id: product.id.id,
            ...productIntent,
          });
        }

        return {
          id: product.id.id,
        };
      })
    );

    await OrderModel.create({
      id: order.id.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      clientId: order.client.id.id,
    });

    await Promise.all(
      order.products.map(async (product) => {
        await OrdersProductsModel.create({
          orderId: order.id.id,
          productId: product.id.id,
        });
      })
    );
  }

  async findOrder(id: string): Promise<Order | null> {
    const orderDb = await OrderModel.findOne({
      where: { id },
      include: [{ model: ProductModel }, { model: ClientModel }],
    });

    const address = new Address(
      orderDb.client.street,
      orderDb.client.number,
      orderDb.client.complement,
      orderDb.client.city,
      orderDb.client.state,
      orderDb.client.zipcode
    );

    const client = new Client({
      id: new Id(orderDb.client.id),
      name: orderDb.client.name,
      email: orderDb.client.email,
      document: orderDb.client.document,
      address,
    });

    const products = orderDb.products.map(
      (product) =>
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
    );

    return new Order({
      id: new Id(orderDb.id),
      client,
      products,
      status: orderDb.status,
    });
  }
}
