import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "addresses",
  timestamps: false,
})
export class AddressModel extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: true })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipCode: string;
}
