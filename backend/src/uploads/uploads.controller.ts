import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('kyc')
  @UseInterceptors(FileInterceptor('file'))
  async uploadKycDocument(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadsService.uploadFile(file, 'kyc');
    return { url };
  }

  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadsService.uploadFile(file, 'profiles');
    return { url };
  }
}
