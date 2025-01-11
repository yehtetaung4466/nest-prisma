import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { S3Service } from 'src/shared/modules/s3/s3.service';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3:S3Service,
    ) {}

    async findAll() {
        const products = await this.prisma.product.findMany({
         include:
         {
           detail:true
         }})
         const productsWithSignedUrls = await Promise.all(
            products.map(async (p) => {
              const { image, ...product } = p;
              if (!image) return { ...product, image: null };
              const signedUrl = await this.s3.getSignedUrl(image); // Ensure this function is async if it uses `await`
              return { ...product, image: signedUrl };
            })
          );
         return productsWithSignedUrls
    }

    async findOne(id:number) {
    const product = await this.prisma.product.findFirst({
     include:{
       detail:true
     },
     where: {
       id
     }
    })
   if(!product) throw new NotFoundException(['product not found'])
   if(product.image){
     product.image = await this.s3.getSignedUrl(product.image)
   }
   return product
    }
    async create(products: ProductDto[]) {
        await this.prisma.$transaction(async(trx)=>{
      
          const promises = products.map(async(product)=>{
            const {image,...rest} = product
            if(!image) return rest
            const uploadedFile = await this.s3.upload(image)
            return {...rest,image:uploadedFile}
          })
          const newProducts = await Promise.all(promises)
          await trx.product.createMany({
            data:newProducts
          })
      
        })
          //
      }

}