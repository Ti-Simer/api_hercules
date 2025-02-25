import { Request } from 'express';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findUserById(id: string): Promise<any>;
    createUser(userData: User): Promise<User>;
    updateUser(id: string, userData: User): Promise<any>;
    deleteUser(id: string): Promise<any>;
    activateUserById(id: string): Promise<any>;
    loginUser(req: Request, loginData: {
        credentials: string;
        password: string;
    }): Promise<any>;
    createMultiple(userData: User): Promise<User>;
}
