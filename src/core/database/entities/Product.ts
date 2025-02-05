import { Entity, PrimaryGeneratedColumn, Column, Index} from 'typeorm';
@Entity({
  name: 'products', // Table name
})
export class Product {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar', // Default type for string in TypeORM
    length: 255, // Optional: define max length
  })
  name: string;

  @Column({
    type: 'int', // Integer type in TypeORM
  })
  price: number;

  @Column({
    type: 'varchar',
    length:255,
    nullable: true,
  })
  image?: string;
  // @Column({
  //   generated:'uuid',
  //   type: 'uuid',
  //   nullable:false,
  // })
  // syskey:string;
}
