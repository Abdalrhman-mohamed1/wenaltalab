import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
}
