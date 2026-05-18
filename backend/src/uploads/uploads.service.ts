import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class UploadsService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET_NAME || 'winaltalab-uploads';

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock',
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const key = `${folder}/${uniqueSuffix}${extname(file.originalname)}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        })
      );
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      // In local dev without keys, we just mock the return
      if (process.env.AWS_ACCESS_KEY_ID === 'mock' || !process.env.AWS_ACCESS_KEY_ID) {
        return `https://mock-s3-bucket/uploads/${key}`;
      }
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }
}
