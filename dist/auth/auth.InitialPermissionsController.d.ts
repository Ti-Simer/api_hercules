import { AuthService } from './auth.service';
export declare class InitialPermissionsController {
    private readonly authService;
    constructor(authService: AuthService);
    createInitialPermissions(): {
        permissions: any;
        roles: unknown;
        user: unknown;
    };
}
