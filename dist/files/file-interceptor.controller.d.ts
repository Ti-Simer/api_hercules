/// <reference types="multer" />
export declare class FileInterceptorController {
    uploadFile(file: Express.Multer.File, body: {
        company: string;
        phone: string;
        email: string;
    }): Promise<{
        message: string;
        imageSize: number;
        imageType: string;
        company: string;
        phone: string;
        email: string;
    }>;
}
