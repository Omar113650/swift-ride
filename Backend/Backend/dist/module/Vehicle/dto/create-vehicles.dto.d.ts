export declare class CreateVehicleDto {
    type: string;
    model: string;
    image?: Express.Multer.File;
    color: string;
    plateNumber: string;
    year: number;
}
