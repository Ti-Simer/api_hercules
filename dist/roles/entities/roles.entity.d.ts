import { Permissions } from 'src/permissions/entities/permission.entity';
export declare class Roles {
    id: string;
    name: string;
    state: string;
    permissions: Permissions[];
    create: Date;
    update: Date;
}
