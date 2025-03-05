import { Permissions } from 'src/permissions/entities/permission.entity';
export declare class Roles {
    id: string;
    name: string;
    state: number;
    permissions: Permissions[];
    create: Date;
    update: Date;
}
