"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const auth_service_1 = require("./auth/auth.service");
const express = require("express");
const bodyParser = require("body-parser");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use('/temp', express.static((0, path_1.join)(__dirname, '..', 'temp')));
    const authService = app.get(auth_service_1.AuthService);
    await authService.createInitialPermissions();
    await authService.createInitialRoles();
    await authService.createInitialUser();
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(4007);
}
bootstrap();
//# sourceMappingURL=main.js.map