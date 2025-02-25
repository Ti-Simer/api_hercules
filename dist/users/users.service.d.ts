import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from './entities/users.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    createUser(userData: User): Promise<any>;
    loginUser(req: Request, credentials: string, password: string): Promise<any>;
    findAll(): Promise<any>;
    deleteUserById(id: string): Promise<any>;
    activateUserById(id: string): Promise<any>;
    findUserById(id: string): Promise<any>;
    updateUserById(id: string, userData: User): Promise<any>;
    createMultiple(data: any): Promise<any>;
}
