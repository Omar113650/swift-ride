import { PrismaService } from '../../core/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
export declare class UserService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    Register(createUserDto: CreateUserDto, res: Response): Promise<{
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
    login(loginDto: LoginDto, res: Response): Promise<{
        user: Object;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string, res: Response): Promise<{
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
    GetProfile(): Promise<{
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
    googleLogin(data: any): Promise<{
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
