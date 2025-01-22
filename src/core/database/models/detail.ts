import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './product';

@Table({
  tableName: 'details',
  timestamps: false,
})
export class Detail extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  more_field:string
  @ForeignKey(() => Product)
  product_id: number;

  @BelongsTo(()=>Product)
  product: Product


}
