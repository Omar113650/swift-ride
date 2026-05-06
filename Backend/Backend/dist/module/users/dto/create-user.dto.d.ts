import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
}
