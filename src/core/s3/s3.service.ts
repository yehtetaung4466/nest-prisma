import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import MultipartFile from '../../shared/classes/multipartfile';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly isLocal: boolean;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_URL');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('AWS_REGION');

    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    this.isLocal = this.configService.get<string>('NODE_ENV') === 'local';
    this.s3Client = new S3Client({
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      region,
      forcePathStyle: this.isLocal,
    });
  }

  async upload(file: MultipartFile): Promise<string> {
    
    const imageBuffer = Buffer.from(file.buffer);
    

    const s3Params = {
      Bucket: this.bucketName,
      Key: `connect-365/${Date.now()}-${file.originalname}`,
      Body: imageBuffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(s3Params);

      await this.s3Client.send(command);
      return s3Params.Key;
  
  }

  // async download(key: string): Promise<any> {
  //   const s3Params = {
  //     Bucket: this.bucketName,
  //     Key: key,
  //   };

  //   const command = new GetObjectCommand(s3Params);
  //   const response = await this.s3Client.send(command);
  //   return response.Body;
  // }

  async getSignedUrl(key: string): Promise<string> {
    const presignedUrlParams = {
      Bucket: this.bucketName,
      Key: key,
    } satisfies GetObjectCommandInput;
      const presignedUrl = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand(presignedUrlParams),
        { expiresIn: 60 * 60 }, // 1 hour
      );

      return presignedUrl
 
  }

  async remove(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await this.s3Client.send(command);
   
  }
}
