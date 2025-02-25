import { Repository } from 'typeorm';
import { Permissions } from './entities/permission.entity';
export declare class PermissionsService {
    private permissionsRepository;
    constructor(permissionsRepository: Repository<Permissions>);
    create(permissionData: Permissions): Promise<any>;
    findAll(): Promise<any>;
    findPermissionById(id: string): Promise<any>;
    updatePermissionById(id: any, permissionData: any): Promise<any>;
    deletePermission(id: string): Promise<any>;
}
