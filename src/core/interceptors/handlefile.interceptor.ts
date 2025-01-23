import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import multer from 'multer';
import sharp from 'sharp';
import { Observable } from 'rxjs';

interface ResizeAndBindOptions {
  required?: boolean;
  allowMimeTypes?: string[]; // List of allowed MIME types
  resizeOptions?: { width: number; height: number }; // Resize dimensions
}

@Injectable()
export class HandleFileInterceptor implements NestInterceptor {
  private readonly upload: multer.Multer;

  constructor(
    private readonly fieldName: string,
    private readonly options: ResizeAndBindOptions = {},
  ) {
    // Set Multer storage configuration (memory storage to keep file in buffer)
    const storage = multer.memoryStorage();

    // Set Multer file filter and size limit (if needed)
    const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
      // Handle "allowMimeTypes" option
      if (this.options.allowMimeTypes && !this.options.allowMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException([`Invalid file type. Allowed types: ${this.options.allowMimeTypes.join(', ')}`]), false);
      }
      cb(null, true);
    };

    this.upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // Example: 5MB file size limit
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    
      const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    
    

    // Use Multer to handle the file upload process
  
      await new Promise<void>((resolve, reject) => {
        this.upload.single(this.fieldName)(request, httpContext.getResponse(), (err: any) => {
          if (err) {
            reject(err); // If any error, reject the promise
          } else {
            resolve(); // Otherwise resolve
          }
        });
      });
      
    

    const file = request.file;

    // Handle "required" option
    if (this.options.required && !file) {
      throw new BadRequestException([`File "${this.fieldName}" is required.`]);
    }

    if (file) {
      // Resize the file and convert to WebP
      const resizeOptions = this.options.resizeOptions || { width: 800, height: 800 };
      const resizedBuffer = await sharp(file.buffer)
        .resize(resizeOptions.width, resizeOptions.height)
        .webp()
        .toBuffer();

      file.buffer = resizedBuffer;
      file.mimetype = 'image/webp';
      file.originalname = file.originalname.split('.')[0] + '.webp';

      // Attach the processed file to req.body
      request.body[this.fieldName] = file;
    }

    return next.handle();
      
  }
}
