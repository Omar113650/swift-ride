import { PrismaService } from '../../core/prisma/prisma.service';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';
import { CreateVehicleDto } from './dto/create-vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicles.dto';
export declare class VehicleService {
    private readonly prisma;
    private readonly cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    private uploadImage;
    private ensureDriverExists;
    private ensureUniquePlate;
    addVehicle(dto: CreateVehicleDto, driverId: string, image?: Express.Multer.File): Promise<{
        type: string;
        id: string;
        isActive: boolean;
        year: number;
        image: string | null;
        model: string;
        color: string;
        plateNumber: string;
        driverId: string;
        imagePublicId: string | null;
        insuranceExpiry: Date | null;
    }>;
    getVehicles(driverId: string): Promise<{
        type: string;
        id: string;
        isActive: boolean;
        year: number;
        image: string | null;
        model: string;
        color: string;
        plateNumber: string;
        driverId: string;
        imagePublicId: string | null;
        insuranceExpiry: Date | null;
    }[]>;
    getVehicleById(id: string): Promise<{
        type: string;
        id: string;
        isActive: boolean;
        year: number;
        image: string | null;
        model: string;
        color: string;
        plateNumber: string;
        driverId: string;
        imagePublicId: string | null;
        insuranceExpiry: Date | null;
    }>;
    deleteVehicle(id: string): Promise<{
        message: string;
    }>;
    updateVehicle(id: string, dto: UpdateVehicleDto, image?: Express.Multer.File): Promise<{
        type: string;
        id: string;
        isActive: boolean;
        year: number;
        image: string | null;
        model: string;
        color: string;
        plateNumber: string;
        driverId: string;
        imagePublicId: string | null;
        insuranceExpiry: Date | null;
    }>;
}
