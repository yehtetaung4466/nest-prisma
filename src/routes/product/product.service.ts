import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from 'src/core/modules/s3/s3.service';
import { Product } from 'src/core/database/models/product';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseProvider } from 'src/core/database/database.provider';
import { Detail } from 'src/core/database/models/detail';
import { ProductDto } from './dto';
@Injectable()
export class ProductService {
    constructor(
        private readonly s3:S3Service,
        private database:DatabaseProvider
    ) {}


    async findAll() {
      const databaseUrl = 'postgres://postgres:password@localhost:5432/connect_db';
      // const db = new Sequelize(databaseUrl,{
      //   models:[Product]
      // })
      const db = this.database.build('domain1')
      const ProductRepo = db.getRepository(Product)
      const products = await ProductRepo.findAll({include:{model:Detail}})
    
      return products;
    }
    
    

  //   async findOne(id:number) {
  //   const product = await this.prisma.product.findFirst({
  //    include:{
  //      detail:true
  //    },
  //    where: {
  //      id
  //    }
  //   })
  //  if(!product) throw new NotFoundException(['product not found'])
  //  if(product.image){
  //    product.image = await this.s3.getSignedUrl(product.image)
  //  }
  //  return
  //   }
    async create(products: ProductDto[]) {

      const db = this.database.build('domain1')
      const ProductRepo = db.getRepository(Product)
      ProductRepo.bulkCreate<Product>([])
      
          //
      }

}