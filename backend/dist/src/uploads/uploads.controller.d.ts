import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadKycDocument(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadProfileImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
