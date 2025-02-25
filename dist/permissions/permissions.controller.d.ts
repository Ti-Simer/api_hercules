import { PermissionsService } from './permissions.service';
import { Permissions } from './entities/permission.entity';
export declare class PermissionsController {
    private permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): Promise<Permissions[]>;
    findPermissionById(id: string): Promise<any>;
    createRol(permissionData: Permissions): Promise<Permissions>;
    updatePermissionById(id: string, permissionData: Permissions): Promise<any>;
    deletePermission(id: string): Promise<any>;
}
