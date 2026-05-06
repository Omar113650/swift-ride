import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import type { Response, Request } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(body: CreateUserDto, res: Response): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(body: LoginDto, res: Response): Promise<{
        user: Object;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    findUser(): Promise<{
        name: string;
        email: string;
        phone: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    refreshToken(req: Request, res: Response): Promise<{
        message: string;
        accessToken: string;
        user: {
            name: string;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            isActive: boolean;
        };
    }>;
    googleLogin(): string;
    googleCallback(req: any): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
