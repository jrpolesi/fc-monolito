import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ClientModel from "./client.model";

@Table({ tableName: "orders", timestamps: false })
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: true })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;

  @BelongsToMany(() => ProductModel, () => OrdersProductsModel)
  declare products: ProductModel[];
}

@Table({ tableName: "products", timestamps: false })
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false })
  declare salesPrice: number;

  @BelongsToMany(() => OrderModel, () => OrdersProductsModel)
  declare orders: OrderModel[];
}

@Table({ tableName: "orders_products", timestamps: false })
export class OrdersProductsModel extends Model {
  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare orderId: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  declare productId: string;
}
