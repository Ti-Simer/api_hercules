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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const uuid_1 = require("uuid");
const bcrypt = require("bcryptjs");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const roles_entity_1 = require("../roles/entities/roles.entity");
const users_entity_1 = require("../users/entities/users.entity");
let AuthService = exports.AuthService = class AuthService {
    constructor(usersRepository, permissionsRepository, rolesRepository) {
        this.usersRepository = usersRepository;
        this.permissionsRepository = permissionsRepository;
        this.rolesRepository = rolesRepository;
    }
    async createInitialPermissions() {
        let existingPermissions = [];
        const initialPermissions = [
            { id: (0, uuid_1.v4)(), name: 'Super_usuario', accessCode: 's', state: 'ACTIVO', description: 'Añade permisos especiales para acciones que lo requieran.' },
            { id: (0, uuid_1.v4)(), name: 'Escritura', accessCode: 'w', state: 'ACTIVO', description: 'La escritura permite al usuario añadir información a los parámetros del sistema.' },
            { id: (0, uuid_1.v4)(), name: 'Lectura', accessCode: 'r', state: 'ACTIVO', description: 'La lectura permite al usuario visualizar la información de los parámetros del sistema.' },
            { id: (0, uuid_1.v4)(), name: 'Edición', accessCode: 'e', state: 'ACTIVO', description: 'La edición permite al usuario cambiar la información de los parámetros del sistema.' },
        ];
        for (let i = 0; i < initialPermissions.length; i++) {
            const permission = await this.permissionsRepository.findOne({
                where: { name: initialPermissions[i].name },
            });
            if (permission) {
                existingPermissions.push(permission);
            }
        }
        if (existingPermissions.length < 1) {
            const createdPermissions = await this.permissionsRepository.save(initialPermissions);
        }
    }
    async createInitialRoles() {
        const permissionsSisCom = [];
        const permissions = await this.permissionsRepository.find();
        permissions.map(permission => {
            if (permission.accessCode === 'r') {
                permissionsSisCom.push(permission);
            }
            if (permission.accessCode === 'w') {
                permissionsSisCom.push(permission);
            }
            if (permission.accessCode === 'e') {
                permissionsSisCom.push(permission);
            }
        });
        const roleNames = [
            'Administrador General',
            'Administrador Comercial',
        ];
        const adminRole = new roles_entity_1.Roles();
        const comercialRole = new roles_entity_1.Roles();
        for (let i = 0; i < roleNames.length; i++) {
            switch (roleNames[i]) {
                case 'Administrador General':
                    adminRole.id = (0, uuid_1.v4)();
                    adminRole.name = roleNames[i];
                    adminRole.state = 'ACTIVO';
                    adminRole.permissions = permissions;
                    break;
                case 'Administrador Comercial':
                    comercialRole.id = (0, uuid_1.v4)();
                    comercialRole.name = roleNames[i];
                    comercialRole.state = 'ACTIVO';
                    comercialRole.permissions = permissionsSisCom;
                    break;
                default:
                    break;
            }
        }
        const existingRole = await this.rolesRepository.findOne({
            where: { name: adminRole.name || comercialRole.name },
        });
        if (!existingRole) {
            let roles = [];
            roles.push(adminRole, comercialRole);
            return await this.rolesRepository.save(roles);
        }
    }
    async createInitialUser() {
        const roleData = await this.rolesRepository.findOne({
            where: { name: 'Administrador General' }
        });
        const hashedPassword = await bcrypt.hash('6ebS#r&#^B6n', 10);
        const userBase = new users_entity_1.User();
        userBase.id = (0, uuid_1.v4)();
        userBase.state = 'ACTIVO';
        userBase.firstName = 'USUARIO';
        userBase.lastName = 'ADMIN';
        userBase.fullName = 'USUARIO ADMIN';
        userBase.email = 'adminuser@admin.com';
        userBase.password = hashedPassword;
        userBase.role = roleData;
        userBase.idNumber = '123456';
        const existingUser = await this.usersRepository.findOne({
            where: { email: userBase.email },
        });
        if (!existingUser) {
            return this.usersRepository.save(userBase);
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(permission_entity_1.Permissions)),
    __param(2, (0, typeorm_2.InjectRepository)(roles_entity_1.Roles)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _c : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map