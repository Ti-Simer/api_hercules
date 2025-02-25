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
exports.InitialPermissionsController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let InitialPermissionsController = exports.InitialPermissionsController = class InitialPermissionsController {
    constructor(authService) {
        this.authService = authService;
    }
    createInitialPermissions() {
        const initialPermissions = this.authService.createInitialPermissions();
        const initialRoles = this.authService.createInitialRoles();
        const initialUser = this.authService.createInitialUser();
        return {
            permissions: initialPermissions,
            roles: initialRoles,
            user: initialUser
        };
    }
};
__decorate([
    (0, common_1.Get)('initial-permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InitialPermissionsController.prototype, "createInitialPermissions", null);
exports.InitialPermissionsController = InitialPermissionsController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], InitialPermissionsController);
//# sourceMappingURL=auth.InitialPermissionsController.js.map