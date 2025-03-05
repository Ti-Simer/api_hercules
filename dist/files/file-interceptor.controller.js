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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInterceptorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
let FileInterceptorController = exports.FileInterceptorController = class FileInterceptorController {
    async uploadFile(file, body) {
        console.log('Datos del formulario:', body);
        console.log('Archivo recibido:', file);
        if (!file) {
            throw new common_1.BadRequestException('El archivo es obligatorio.');
        }
        if (!body.company || !body.phone || !body.email) {
            throw new common_1.BadRequestException('Faltan datos obligatorios en el formulario.');
        }
        const imageBuffer = file.buffer;
        return {
            message: 'Formulario recibido exitosamente',
            imageSize: file.size,
            imageType: file.mimetype,
            company: body.company,
            phone: body.phone,
            email: body.email,
        };
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileInterceptorController.prototype, "uploadFile", null);
exports.FileInterceptorController = FileInterceptorController = __decorate([
    (0, common_1.Controller)('api/files')
], FileInterceptorController);
//# sourceMappingURL=file-interceptor.controller.js.map