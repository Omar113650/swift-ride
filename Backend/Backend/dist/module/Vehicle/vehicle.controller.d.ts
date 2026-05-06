import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicles.dto';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    addVehicle(driverId: string, dto: CreateVehicleDto, image?: Express.Multer.File): Promise<{
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
    getVehicle(id: string): Promise<{
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
