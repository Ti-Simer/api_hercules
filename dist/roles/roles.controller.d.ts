import { RolesService } from './roles.service';
import { Roles } from './entities/roles.entity';
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<Roles[]>;
    findOne(id: string): Promise<any>;
    create(rolesData: Roles): Promise<Roles>;
    update(id: string, roleData: Roles): Promise<any>;
    remove(id: string): Promise<any>;
}
