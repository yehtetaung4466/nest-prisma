import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import MultipartFile from '../classes/multipartfile';

@Injectable()
export class ImageProcessingService {
  /**
   * Resize an image to 800x800 pixels and convert it to WebP format.
   *
   * @param file - The multipart file to process.
   * @returns A new instance of MultipartFile with the resized image.
   */
  async resize(file: MultipartFile): Promise<MultipartFile> {
    try {
      const resizedBuffer = await sharp(file.buffer)
        .resize(800, 800)
        .webp()
        .toBuffer();

      file.buffer = resizedBuffer;
      file.mimetype = 'image/webp';
      file.originalname = `${file.originalname.split('.')[0]}.webp`;

      return new MultipartFile(file);
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }
}