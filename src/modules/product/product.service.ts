import { Injectable} from '@nestjs/common';
import { S3Service } from 'src/core/s3/s3.service';
import { DatabaseProvider } from 'src/core/database/database.provider';

import { ProductDto } from './dto';
import { Product } from 'src/core/database/entities/Product';
@Injectable()
export class ProductService {
    constructor(
        private readonly s3:S3Service,
        private database:DatabaseProvider
    ) {}


    async findAll() {
      const db = await this.database.build('domain1')
      const queryBuilder = db
      .createQueryBuilder()
      // const products = await queryBuilder
      // .select("id,name,price,image")
      // .from(Product,'p')
      // .where('p.id = :id' ,{id:3})
      // .getRawMany()
      const ProductRepo = db.getRepository(Product)
      const products = await ProductRepo.find()
       const finalProducts = await Promise.all(products.map(async(p)=>{
        if(p.image){
          p.image = await this.s3.getSignedUrl(p.image)
        }
        return p
      }))
      return finalProducts;
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

      const db = await this.database.build('domain1')
      const ProductRepo = db.getRepository(Product)
      const productsToInsertsPromises =  products.map(async(p)=>{
        let image:string = undefined
        if(p.image) {
          image = await this.s3.upload(p.image)
        }
        delete p.image
        return {
          ...p,
          image,
        }
      })
      const ps = await Promise.all(productsToInsertsPromises)
      await ProductRepo.insert(ps)
      
          //
      }

}