import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AddressModel } from "./address.model";
import { InvoiceItemModel } from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @ForeignKey(() => AddressModel)
  address_id: number;

  @BelongsTo(() => AddressModel)
  address: AddressModel;

  @HasMany(() => InvoiceItemModel)
  items: InvoiceItemModel[];

  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @Column({ allowNull: false, field: "updated_at" })
  updatedAt: Date;
}
