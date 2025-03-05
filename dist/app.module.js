"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const auth_module_1 = require("./auth/auth.module");
const throttler_1 = require("@nestjs/throttler");
const users_module_1 = require("./users/users.module");
const locations_module_1 = require("./locations/locations.module");
const storage_tanks_module_1 = require("./storage-tanks/storage-tanks.module");
const devices_module_1 = require("./devices/devices.module");
const data_module_1 = require("./data/data.module");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60,
                    limit: 15,
                }]),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: 'root',
                password: '123',
                database: 'hercules_montagas',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            auth_module_1.AuthModule,
            locations_module_1.LocationsModule,
            storage_tanks_module_1.StorageTanksModule,
            devices_module_1.DevicesModule,
            data_module_1.DataModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map