import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Request } from 'express';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async createUser(userData: User): Promise<any> {
    try {
      if (userData) {
        
        // Verificar si ya existe un usuario con el numero de identificación
        const existingUser = await this.usersRepository
          .createQueryBuilder('usuario')
          .where('usuario.idNumber = :idNumber OR usuario.email = :email', { idNumber: userData.idNumber, email: userData.email })
          .getOne();

        if (existingUser) {
          return ResponseUtil.error(400, 'El numero de identificación o email ya esta registrado');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.firstName = userData.firstName.toUpperCase();
        userData.lastName = userData.lastName.toUpperCase();
        userData.fullName = `${userData.firstName} ${userData.lastName}`;

        const newUser = this.usersRepository.create({
          ...userData,
          password: hashedPassword, // Asigna la contraseña cifrada
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          status: 'DISPONIBLE'
        });

        const createdUser = await this.usersRepository.save(newUser);

        if (createdUser) {
          return ResponseUtil.success(
            200,
            'Usuario creado exitosamente',
            createdUser
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el usuario'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el usuario',
        error.message
      );
    }
  }

  async loginUser(@Req() req: Request, credentials: string, password: string): Promise<any> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .where('usuario.email = :credentials OR usuario.idNumber = :credentials', { credentials })
        .getOne();

      if (!user) {
        return ResponseUtil.error(404, 'Usuario no encontrado');
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
        return ResponseUtil.error(401, 'Contraseña incorrecta');
      }

      // Generar un token de acceso
      const accessToken = jwt.sign(
        { userId: user.id, key: 'poseidon-M0NT4645+.6040', color: '#014e87', system: 'Poseidon' },
        'poseidon',
        { expiresIn: '1h' }
      );

      console.log('====================================Usuario logueado====================================');
      console.log(`Hora del servidor: ${currentTime}`);
      console.log(`Usuario: ${user.firstName}, ${user.lastName}`);
      console.log(`Identificación: ${user.idNumber}`);
      console.log(`Rol: ${user.role.name}`);
      console.log(`IP del cliente: ${clientIp}`);
      console.log('========================================================================================');

      return ResponseUtil.success(200, 'Inicio de sesión exitoso', { user, accessToken });

    } catch (error) {
      return ResponseUtil.error(500, 'Error al iniciar sesión');
    }
  }

  async findAll(): Promise<any> {
    try {
      const users = await this.usersRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .getMany();

      if (users.length < 1) {
        return ResponseUtil.error(
          400,
          'Usuarios no encontrados',
        );
      } else {
        return ResponseUtil.success(
          200,
          'Usuarios encontrados',
          users
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los usuarios'
      );
    }
  }

  async deleteUserById(id: string): Promise<any> {
    try {
      const existingTablet = await this.usersRepository.findOne({
        where: { id },
      });

      if (!existingTablet) {
        return ResponseUtil.error(404, 'Usuario no encontrado');
      }

      existingTablet.state = 'INACTIVO';
      const updatedTablet = await this.usersRepository.save(existingTablet);

      if (updatedTablet) {
        return ResponseUtil.success(
          200,
          'Usuario eliminado exitosamente',
          updatedTablet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Usuario'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Usuario'
      );
    }
  }

  async activateUserById(id: string): Promise<any> {
    try {
      const existingTablet = await this.usersRepository.findOne({
        where: { id },
      });

      if (!existingTablet) {
        return ResponseUtil.error(404, 'Usuario no encontrado');
      }

      existingTablet.state = 'ACTIVO';
      const updatedTablet = await this.usersRepository.save(existingTablet);

      if (updatedTablet) {
        return ResponseUtil.success(
          200,
          'Usuario eliminado exitosamente',
          updatedTablet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Usuario'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Usuario'
      );
    }
  }

  async findUserById(id: string): Promise<any> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .leftJoinAndSelect('rol.permissions', 'permissions')
        .where('usuario.id = :id', { id })
        .getOne();

      if (user) {
        return ResponseUtil.success(
          200,
          'Usuario encontrado',
          user
        );
      } else {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el usuario'
      );
    }
  }

  async updateUserById(id: string, userData: User): Promise<any> {
    try {
      const existingUser = await this.usersRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .where('usuario.id = :id', { id })
        .getOne();

      if (!existingUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const updatedUser = await this.usersRepository.save({
        ...existingUser,
        ...userData,
        password: hashedPassword,
      });

      return ResponseUtil.success(
        200,
        'Usuario actualizado exitosamente',
        updatedUser
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el usuario'
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////////


  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdUsers = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item: any) => this.createUser(item));
      const responses = await Promise.all(promises);

      const successfulUsers = responses
        .filter(response => response.statusCode === 200)
        .map(response => response.data.id);

      createdUsers.push(...successfulUsers);
    }

    return ResponseUtil.success(
      200,
      'Usuarios creados exitosamente',
      createdUsers
    );
  }
}



