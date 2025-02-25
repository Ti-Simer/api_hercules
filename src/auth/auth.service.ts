import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Permissions } from '../permissions/entities/permission.entity';
import { Roles } from '../roles/entities/roles.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) { }

  async createInitialPermissions() {

    let existingPermissions: Permissions[] = [];

    const initialPermissions = [
      { id: uuidv4(), name: 'Super_usuario', accessCode: 's', state: 'ACTIVO', description: 'Añade permisos especiales para acciones que lo requieran.' },
      { id: uuidv4(), name: 'Escritura', accessCode: 'w', state: 'ACTIVO', description: 'La escritura permite al usuario añadir información a los parámetros del sistema.' },
      { id: uuidv4(), name: 'Lectura', accessCode: 'r', state: 'ACTIVO', description: 'La lectura permite al usuario visualizar la información de los parámetros del sistema.' },
      { id: uuidv4(), name: 'Edición', accessCode: 'e', state: 'ACTIVO', description: 'La edición permite al usuario cambiar la información de los parámetros del sistema.' },
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
    const permissionsSisCom: any[] = [];
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

    const adminRole = new Roles();
    const comercialRole = new Roles();

    for (let i = 0; i < roleNames.length; i++) {

      switch (roleNames[i]) {
        case 'Administrador General':
          adminRole.id = uuidv4();
          adminRole.name = roleNames[i];
          adminRole.state = 'ACTIVO';
          adminRole.permissions = permissions;
          break;

        case 'Administrador Comercial':
          comercialRole.id = uuidv4();
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
      let roles: any[] = [];
      roles.push(adminRole, comercialRole);
      return await this.rolesRepository.save(roles);
    }

  }

  async createInitialUser() {
    const roleData = await this.rolesRepository.findOne({
      where: { name: 'Administrador General' }
    });

    const hashedPassword = await bcrypt.hash('6ebS#r&#^B6n', 10);

    const userBase = new User();
    userBase.id = uuidv4();
    userBase.state = 'ACTIVO';
    userBase.firstName = 'USUARIO';
    userBase.lastName = 'ADMIN';
    userBase.fullName = 'USUARIO ADMIN';
    userBase.email = 'adminuser@admin.com';
    userBase.password = hashedPassword;
    userBase.role = roleData;
    userBase.idNumber = '123456';

    const existingUser = await this.usersRepository.findOne({
      where: { email: userBase.email }, // Busca por email en lugar de name
    });

    if (!existingUser) {
      return this.usersRepository.save(userBase);
    }
  }
}
