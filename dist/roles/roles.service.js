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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const response_util_1 = require("../utils/response.util");
const uuid_1 = require("uuid");
const roles_entity_1 = require("./entities/roles.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
let RolesService = exports.RolesService = class RolesService {
    constructor(rolesRepository, permissionsRepository) {
        this.rolesRepository = rolesRepository;
        this.permissionsRepository = permissionsRepository;
    }
    async findAll() {
        try {
            const roles = await this.rolesRepository.find({
                where: { state: 1 },
                relations: ['permissions'],
            });
            if (roles) {
                return response_util_1.ResponseUtil.success(200, 'Roles encontrados', roles);
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al obtener los roles');
        }
    }
    async findOne(id) {
        try {
            const role = await this.rolesRepository.findOne({
                where: { id },
                relations: ['permissions'],
            });
            if (role) {
                return response_util_1.ResponseUtil.success(200, 'Rol encontrado', role);
            }
            else {
                return response_util_1.ResponseUtil.error(404, 'Rol no encontrado');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al obtener el rol');
        }
    }
    async create(rolesData) {
        try {
            if (rolesData) {
                const existingRole = await this.rolesRepository.findOne({
                    where: { name: rolesData.name },
                    relations: ['permissions'],
                });
                if (existingRole) {
                    return response_util_1.ResponseUtil.error(400, 'El rol ya existe');
                }
                const permissions = await this.permissionsRepository.findByIds(rolesData.permissions);
                const newRole = this.rolesRepository.create({
                    ...rolesData,
                    id: (0, uuid_1.v4)(),
                    state: 1,
                    permissions: permissions
                });
                const createdRole = await this.rolesRepository.save(newRole);
                if (createdRole) {
                    return response_util_1.ResponseUtil.success(200, 'Rol creado exitosamente', createdRole);
                }
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al crear el Rol');
        }
    }
    async remove(id) {
        try {
            const existingRol = await this.rolesRepository.findOne({
                where: { id },
            });
            if (!existingRol) {
                return response_util_1.ResponseUtil.error(404, 'Rol no encontrado');
            }
            existingRol.state = 0;
            const updatedRol = await this.rolesRepository.save(existingRol);
            if (updatedRol) {
                return response_util_1.ResponseUtil.success(200, 'Rol eliminado exitosamente', updatedRol);
            }
            else {
                return response_util_1.ResponseUtil.error(500, 'Ha ocurrido un problema al eliminar el Rol');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al eliminar el Rol');
        }
    }
    async update(id, roleData) {
        try {
            const existingRol = await this.rolesRepository.findOne({
                where: { id },
            });
            if (!existingRol) {
                throw new common_1.NotFoundException('Rol no encontrado');
            }
            const permissions = await this.permissionsRepository.findByIds(roleData.permissions);
            const updatedUser = await this.rolesRepository.save({
                ...existingRol,
                ...roleData,
                permissions: permissions,
            });
            return response_util_1.ResponseUtil.success(200, 'Rol actualizado exitosamente', updatedUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return response_util_1.ResponseUtil.error(404, 'Rol no encontrado');
            }
            return response_util_1.ResponseUtil.error(500, 'Error al actualizar el Rol');
        }
    }
};
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(roles_entity_1.Roles)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permissions)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map