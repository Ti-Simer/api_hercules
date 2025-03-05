import { AuthService } from './auth.service';
export declare class InitialPermissionsController {
    private readonly authService;
    constructor(authService: AuthService);
    createInitialPermissions(): {
        permissions: Promise<void>;
        roles: Promise<any[]>;
        user: Promise<import("../users/entities/users.entity").User>;
    };
}
