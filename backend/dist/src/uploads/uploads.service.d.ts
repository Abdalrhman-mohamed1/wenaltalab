export declare class UploadsService {
    private s3;
    private bucketName;
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
}
