import { Express } from 'express';
export declare class FileInterceptorController {
    uploadFile(file: Express.Multer.File, body: {
        company: string;
        phone: string;
        email: string;
    }): unknown;
}
