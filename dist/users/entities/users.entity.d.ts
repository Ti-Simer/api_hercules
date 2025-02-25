import { Roles } from 'src/roles/entities/roles.entity';
export declare class User {
    id: string;
    state: string;
    status: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    idNumber: string;
    password: string;
    create: Date;
    update: Date;
    role: Roles;
}
