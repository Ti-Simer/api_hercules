import { Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { Permissions } from 'src/permissions/entities/permission.entity';
export declare class RolesService {
    private rolesRepository;
    private permissionsRepository;
    constructor(rolesRepository: Repository<Roles>, permissionsRepository: Repository<Permissions>);
    findAll(): Promise<any>;
    findOne(id: any): Promise<any>;
    create(rolesData: Roles): Promise<any>;
    remove(id: string): Promise<any>;
    update(id: any, roleData: any): Promise<any>;
}
