import { Injectable, NestInterceptor, ExecutionContext, BadRequestException, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import sharp from 'sharp';
import { MultipartRequest, parse } from 'lambda-multipart-parser-v2';
import multer from 'multer';
import MultipartFile from 'src/shared/classes/multipartfile';

interface ResizeAndBindOptions {
  required?: boolean;
  allowMimeTypes?: string[];
  resizeOptions?: { width: number; height: number };
}

@Injectable()
export class HandleFileInterceptor implements NestInterceptor {
  private readonly upload: multer.Multer;

  constructor(
    private readonly fieldName: string,
    private readonly options: ResizeAndBindOptions = {},
  ) {
    // Initialize multer for local development
    const storage = multer.memoryStorage();
    const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
      if (this.options.allowMimeTypes && !this.options.allowMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException([`Invalid file type. Allowed types: ${this.options.allowMimeTypes.join(', ')}`]), false);
      }
      cb(null, true);
    };

    this.upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 20 * 1024 * 1024 }, // Example: 20MB file size limit
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const contentType = request.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return next.handle();
    }

    if (this.isApiGatewayEvent(request)) {
      await this.handleCloudFileUpload(request);
    } else {
      await this.handleLocalFileUpload(request,response);
    }

    return next.handle();
  }

  private isApiGatewayEvent(request: any): boolean {
    // Check if the request contains API Gateway event properties
    return !!request.apiGateway?.event;
  }

  private async handleLocalFileUpload(request: any,response:any): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.upload.single(this.fieldName)(request, response, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const file = request.file;

    if (this.options.required && !file) {
      throw new BadRequestException([`File "${this.fieldName}" is required.`]);
    }

    if (file) {
      const resizeOptions = this.options.resizeOptions || { width: 800, height: 800 };
      const resizedBuffer = await sharp(file.buffer)
        .resize(resizeOptions)
        .webp()
        .toBuffer();

      file.buffer = resizedBuffer;
      file.mimetype = 'image/webp';
      file.originalname = this.getWebpFilename(file.originalname);
      

      request.body[this.fieldName] = file;
    }
  }

  private async handleCloudFileUpload(request: any): Promise<void> {
    const event = request.apiGateway.event;

    let parsedResult:MultipartRequest;
    try {
      parsedResult = await parse(event);
    } catch (error) {
      throw new BadRequestException([`Failed to parse multipart data: ${error.message}`]);
    }
    const {files,...otherFields} = parsedResult
    const file = files.find(f => f.fieldname === this.fieldName);

    if (this.options.required && !file) {
      throw new BadRequestException([`File "${this.fieldName}" is required.`]);
    }

    if (file) {
      if (this.options.allowMimeTypes && !this.options.allowMimeTypes.includes(file.contentType)) {
        throw new BadRequestException([
          `Invalid file type for ${this.fieldName}. Allowed types: ${this.options.allowMimeTypes.join(', ')}`
        ]);
      }

      const resizeOptions = this.options.resizeOptions || { width: 800, height: 800 };
      const processedBuffer = await sharp(file.content)
        .resize(resizeOptions)
        .webp()
        .toBuffer();

      const processedFile = {
        fieldname: this.fieldName,
        originalname: this.getWebpFilename(file.filename),
        mimetype: 'image/webp',
        buffer: processedBuffer,
        size: processedBuffer.byteLength,
        encoding: file.encoding
      };
      request.body = {}
      request.body[this.fieldName] = processedFile;
      Object.keys(otherFields).forEach(key => {
        const value = otherFields[key];
        request.body[key] = isNaN(Number(value)) ? value : Number(value);
      });
      
      
      
    }
  }

  private getWebpFilename(originalName: string): string {
    return originalName.replace(/\.[^/.]+$/, '') + '.webp';
  }
}