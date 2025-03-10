"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const auth_InitialPermissionsController_1 = require("./auth.InitialPermissionsController");
const roles_entity_1 = require("../roles/entities/roles.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const users_entity_1 = require("../users/entities/users.entity");
let AuthModule = exports.AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                users_entity_1.User,
                permission_entity_1.Permissions,
                roles_entity_1.Roles,
            ]),
        ],
        controllers: [
            auth_InitialPermissionsController_1.InitialPermissionsController
        ],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map