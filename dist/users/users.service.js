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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const response_util_1 = require("../utils/response.util");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const users_entity_1 = require("./entities/users.entity");
let UsersService = exports.UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async createUser(userData) {
        try {
            if (userData) {
                const existingUser = await this.usersRepository
                    .createQueryBuilder('usuario')
                    .where('usuario.idNumber = :idNumber OR usuario.email = :email', { idNumber: userData.idNumber, email: userData.email })
                    .getOne();
                if (existingUser) {
                    return response_util_1.ResponseUtil.error(400, 'El numero de identificación o email ya esta registrado');
                }
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                userData.firstName = userData.firstName.toUpperCase();
                userData.lastName = userData.lastName.toUpperCase();
                userData.fullName = `${userData.firstName} ${userData.lastName}`;
                const newUser = this.usersRepository.create({
                    ...userData,
                    password: hashedPassword,
                    id: (0, uuid_1.v4)(),
                    state: 1,
                    status: 'DISPONIBLE'
                });
                const createdUser = await this.usersRepository.save(newUser);
                if (createdUser) {
                    return response_util_1.ResponseUtil.success(200, 'Usuario creado exitosamente', createdUser);
                }
                else {
                    return response_util_1.ResponseUtil.error(500, 'Ha ocurrido un problema al crear el usuario');
                }
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al crear el usuario', error.message);
        }
    }
    async loginUser(req, credentials, password) {
        try {
            const user = await this.usersRepository
                .createQueryBuilder('usuario')
                .leftJoinAndSelect('usuario.role', 'rol')
                .where('usuario.email = :credentials OR usuario.idNumber = :credentials', { credentials })
                .getOne();
            if (!user) {
                return response_util_1.ResponseUtil.error(404, 'Usuario no encontrado');
            }
            if (user.state === 0) {
                return response_util_1.ResponseUtil.error(401, 'Usuario inactivo');
            }
            const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            const clientIp = req.ip;
            if (!isPasswordValid) {
                console.log('====================================Contraseña incorrecta===============================');
                console.log(`Hora del servidor: ${currentTime}`);
                console.log(`Usuario: ${user.firstName}, ${user.lastName}`);
                console.log(`Identificación: ${user.idNumber}`);
                console.log(`Rol: ${user.role.name}`);
                console.log(`IP del cliente: ${clientIp}`);
                console.log('========================================================================================');
                return response_util_1.ResponseUtil.error(401, 'Contraseña incorrecta');
            }
            const accessToken = jwt.sign({ userId: user.id, key: 'hercules-M0NT4645+.6040', color: '#2E6187', system: 'Hercules' }, 'poseidon', { expiresIn: '1h' });
            console.log('====================================Usuario logueado====================================');
            console.log(`Hora del servidor: ${currentTime}`);
            console.log(`Usuario: ${user.firstName}, ${user.lastName}`);
            console.log(`Identificación: ${user.idNumber}`);
            console.log(`Rol: ${user.role.name}`);
            console.log(`IP del cliente: ${clientIp}`);
            console.log('========================================================================================');
            return response_util_1.ResponseUtil.success(200, 'Inicio de sesión exitoso', { user, accessToken });
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al iniciar sesión');
        }
    }
    async findAll() {
        try {
            const users = await this.usersRepository
                .createQueryBuilder('usuario')
                .leftJoinAndSelect('usuario.role', 'rol')
                .getMany();
            if (users.length < 1) {
                return response_util_1.ResponseUtil.error(400, 'Usuarios no encontrados');
            }
            else {
                return response_util_1.ResponseUtil.success(200, 'Usuarios encontrados', users);
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al obtener los usuarios');
        }
    }
    async deleteUserById(id) {
        try {
            const existingTablet = await this.usersRepository.findOne({
                where: { id },
            });
            if (!existingTablet) {
                return response_util_1.ResponseUtil.error(404, 'Usuario no encontrado');
            }
            existingTablet.state = 0;
            const updatedTablet = await this.usersRepository.save(existingTablet);
            if (updatedTablet) {
                return response_util_1.ResponseUtil.success(200, 'Usuario eliminado exitosamente', updatedTablet);
            }
            else {
                return response_util_1.ResponseUtil.error(500, 'Ha ocurrido un problema al eliminar el Usuario');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al eliminar el Usuario');
        }
    }
    async activateUserById(id) {
        try {
            const existingTablet = await this.usersRepository.findOne({
                where: { id },
            });
            if (!existingTablet) {
                return response_util_1.ResponseUtil.error(404, 'Usuario no encontrado');
            }
            existingTablet.state = 1;
            const updatedTablet = await this.usersRepository.save(existingTablet);
            if (updatedTablet) {
                return response_util_1.ResponseUtil.success(200, 'Usuario eliminado exitosamente', updatedTablet);
            }
            else {
                return response_util_1.ResponseUtil.error(500, 'Ha ocurrido un problema al eliminar el Usuario');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al eliminar el Usuario');
        }
    }
    async findUserById(id) {
        try {
            const user = await this.usersRepository
                .createQueryBuilder('usuario')
                .leftJoinAndSelect('usuario.role', 'rol')
                .leftJoinAndSelect('rol.permissions', 'permissions')
                .where('usuario.id = :id', { id })
                .getOne();
            if (user) {
                return response_util_1.ResponseUtil.success(200, 'Usuario encontrado', user);
            }
            else {
                return response_util_1.ResponseUtil.error(404, 'Usuario no encontrado');
            }
        }
        catch (error) {
            return response_util_1.ResponseUtil.error(500, 'Error al obtener el usuario');
        }
    }
    async updateUserById(id, userData) {
        try {
            const existingUser = await this.usersRepository
                .createQueryBuilder('usuario')
                .leftJoinAndSelect('usuario.role', 'rol')
                .where('usuario.id = :id', { id })
                .getOne();
            if (!existingUser) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const updatedUser = await this.usersRepository.save({
                ...existingUser,
                ...userData,
                password: hashedPassword,
            });
            return response_util_1.ResponseUtil.success(200, 'Usuario actualizado exitosamente', updatedUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return response_util_1.ResponseUtil.error(404, 'Usuario no encontrado');
            }
            return response_util_1.ResponseUtil.error(500, 'Error al actualizar el usuario');
        }
    }
    async createMultiple(data) {
        const chunkSize = 500;
        const createdUsers = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            const promises = chunk.map((item) => this.createUser(item));
            const responses = await Promise.all(promises);
            const successfulUsers = responses
                .filter(response => response.statusCode === 200)
                .map(response => response.data.id);
            createdUsers.push(...successfulUsers);
        }
        return response_util_1.ResponseUtil.success(200, 'Usuarios creados exitosamente', createdUsers);
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "loginUser", null);
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map