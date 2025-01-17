import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { S3Service } from 'src/shared/modules/s3/s3.service';
import { ProductDto } from './dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { Sequelize } from 'sequelize';
import {getAllProduct} from '@prisma/client/sql'
@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3:S3Service,
    ) {}

    async findAll() {
      const databaseUrl = 'postgres://postgres:password@localhost:5432/connect_db';
      const db = this.prisma.buildDb(databaseUrl);
    
      // Simulate user input for the injection test
      const userInput = "' OR 1=1 --";  // This would simulate an SQL injection
    
      // Vulnerable query where user input is directly concatenated
      const query = Prisma.sql`
        SELECT p.*, JSON_BUILD_OBJECT(
          'id', d.id,
          'description', d.description
        ) AS detail
        FROM products p
        LEFT JOIN details d ON p.id = d.product_id;
      `;
    
      // Running the potentially unsafe query
      const products = await db.$queryRaw(query);
    
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
  //   async create(products: ProductDto[]) {
  //       await this.prisma.$transaction(async(trx)=>{
      
  //         const promises = products.map(async(product)=>{
  //           const {image,...rest} = product
  //           if(!image) return rest
  //           const uploadedFile = await this.s3.upload(image)
  //           return {...rest,image:uploadedFile}
  //         })
  //         const newProducts = await Promise.all(promises)
  //         await trx.product.createMany({
  //           data:newProducts
  //         })
      
  //       })
  //         //
  //     }

}