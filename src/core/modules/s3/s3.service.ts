import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import MultipartFile from '../../../shared/classes/multipartfile';

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

    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', 'my-bucket');
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
      Key: `product-images/${Date.now()}-${file.originalname}`,
      Body: imageBuffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(s3Params);

    try {
      await this.s3Client.send(command);
      return s3Params.Key;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async download(key: string): Promise<any> {
    const s3Params = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(s3Params);

    try {
      const response = await this.s3Client.send(command);
      return response.Body;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    const presignedUrlParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const presignedUrl = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand(presignedUrlParams),
        { expiresIn: 60 * 60 }, // 1 hour
      );

      return this.isLocal
        ? presignedUrl.replace('minio', 'localhost')
        : presignedUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
