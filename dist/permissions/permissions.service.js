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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const response_util_1 = require("../utils/response.util");
const uuid_1 = require("uuid");
const permission_entity_1 = require("./entities/permission.entity");
let PermissionsService = exports.PermissionsService = class PermissionsService {
    constructor(permissionsRepository) {
        this.permissionsRepository = permissionsRepository;
    }
    async create(permissionData) {
        try {
            if (permissionData) {
                const existingUser = await this.permissionsRepository.findOne({
                    where: { name: permissionData.name },
                });
                if (existingUser) {
                    return response_util_1.ResponseUtil.error(400, 'El permiso ya existe');
                }
                const newPermission = this.permissionsRepository.create({
                    ...permissionData,
                    id: (0, uuid_1.v4)(),
                    state: 'ACTIVO'
                });
                const createdPermission = await this.permissionsRepository.save(newPermission);
                if (createdPermission) {
                    return response_util_1.ResponseUtil.success(200, 'Permiso creado exitosamente', createdPermission);
                }
                else {
                    return response_util_1.ResponseUtil.error(500, 'Ha ocurrido un problema al crear el Permiso');
                }
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al crear el Permiso');
        }
    }
    async findAll() {
        try {
            const permissions = await this.permissionsRepository.find({ where: { state: 'ACTIVO' } });
            if (permissions) {
                return response_util_1.ResponseUtil.success(200, 'Permisos encontrados', permissions);
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al obtener los permisos');
        }
    }
    async findPermissionById(id) {
        try {
            const permission = await this.permissionsRepository.findOneBy({
                id: id
            });
            if (permission) {
                return response_util_1.ResponseUtil.success(200, 'permiso encontrado', permission);
            }
            else {
                return response_util_1.ResponseUtil.error(404, 'permiso no encontrado');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al obtener el permiso');
        }
    }
    async updatePermissionById(id, permissionData) {
        try {
            const existingPermission = await this.permissionsRepository.findOne({
                where: { id },
            });
            if (!existingPermission) {
                throw new common_1.NotFoundException('Permiso no encontrado');
            }
            const updatedUser = await this.permissionsRepository.save({
                ...existingPermission,
                ...permissionData,
            });
            return response_util_1.ResponseUtil.success(200, 'Permiso actualizado exitosamente', updatedUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return response_util_1.ResponseUtil.error(404, 'Permiso no encontrado');
            }
            return response_util_1.ResponseUtil.error(500, 'Error al actualizar el Permiso');
        }
    }
    async deletePermission(id) {
        try {
            const existingPermission = await this.permissionsRepository.findOne({
                where: { id },
            });
            if (!existingPermission) {
                return response_util_1.ResponseUtil.error(404, 'Permiso no encontrado');
            }
            existingPermission.state = 'INACTIVO';
            const updatedPermission = await this.permissionsRepository.save(existingPermission);
            if (updatedPermission) {
                return response_util_1.ResponseUtil.success(200, 'Permiso eliminado exitosamente', updatedPermission);
            }
            else {
                return response_util_1.ResponseUtil.error(500, 'Ha ocurrido un problema al eliminar el Permiso');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al eliminar el Permiso');
        }
    }
};
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permissions)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map