"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = require("path");
let UploadsService = class UploadsService {
    s3;
    bucketName = process.env.AWS_S3_BUCKET_NAME || 'winaltalab-uploads';
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock',
            },
        });
    }
    async uploadFile(file, folder = 'general') {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const key = `${folder}/${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`;
        try {
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }));
            return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        }
        catch (error) {
            if (process.env.AWS_ACCESS_KEY_ID === 'mock' || !process.env.AWS_ACCESS_KEY_ID) {
                return `https://mock-s3-bucket/uploads/${key}`;
            }
            throw new common_1.InternalServerErrorException('Failed to upload file to S3');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map