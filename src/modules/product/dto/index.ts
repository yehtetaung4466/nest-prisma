import {IsInstance, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'
import MultipartFile from 'src/shared/classes/multipartfile'
import { Type } from 'class-transformer';
export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    price: number
    
    @IsOptional()
    image?: MultipartFile
}