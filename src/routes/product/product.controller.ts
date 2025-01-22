import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import DAO from 'src/shared/classes/dao';
import { ProductDto } from './dto';
import { HandleFileInterceptor } from 'src/core/interceptors/handlefile.interceptor';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return new DAO(['products'],products)
  }

  // @Get(':id')
  // async findOne(id: number) {
  //   const product = await this.productService.findOne(id);
  //   return new DAO(['product'], product)
  // }
  // @UseInterceptors(
  //   new HandleFileInterceptor('image',{
  //     required: true
  //   })
  // )
  // @Post()
  // async create(
  //   @Body() product: ProductDto) {
  //   const createdProduct = await this.productService.create([product]);
  //   return new DAO(['product'], createdProduct)
  // }
 
}
