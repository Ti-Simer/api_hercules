import { Repository } from 'typeorm';
import { Permissions } from '../permissions/entities/permission.entity';
import { Roles } from '../roles/entities/roles.entity';
import { User } from 'src/users/entities/users.entity';
export declare class AuthService {
    private readonly usersRepository;
    private readonly permissionsRepository;
    private readonly rolesRepository;
    constructor(usersRepository: Repository<User>, permissionsRepository: Repository<Permissions>, rolesRepository: Repository<Roles>);
    createInitialPermissions(): Promise<void>;
    createInitialRoles(): Promise<any[]>;
    createInitialUser(): Promise<User>;
}
