import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('VehicleService', () => {
  let service: VehicleService;
  let prisma: PrismaService;
  let cloudinary: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: PrismaService,
          useValue: {
            driver: { findUnique: jest.fn() },
            vehicle: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    prisma = module.get<PrismaService>(PrismaService);
    cloudinary = module.get<CloudinaryService>(CloudinaryService);
  });

  describe('addVehicle', () => {
    it('should throw NotFoundException if driver does not exist', async () => {
      (prisma.driver.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.addVehicle({ plateNumber: '123' } as any, 'driverId'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if plate already exists', async () => {
      (prisma.driver.findUnique as jest.Mock).mockResolvedValue({ id: 'driverId' });
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ id: 'vehicleId' });

      await expect(
        service.addVehicle({ plateNumber: '123' } as any, 'driverId'),
      ).rejects.toThrow(ConflictException);
    });

    it('should create vehicle successfully', async () => {
      (prisma.driver.findUnique as jest.Mock).mockResolvedValue({ id: 'driverId' });
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);
      (cloudinary.uploadFile as jest.Mock).mockResolvedValue({ secure_url: 'http://image.url' });
      (prisma.vehicle.create as jest.Mock).mockResolvedValue({ id: 'newVehicle' });

      const result = await service.addVehicle({ plateNumber: '123' } as any, 'driverId', {} as any);

      expect(result).toEqual({ id: 'newVehicle' });
      expect(prisma.vehicle.create).toHaveBeenCalled();
    });
  });

  describe('updateVehicle', () => {
    it('should throw NotFoundException if vehicle not found', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateVehicle('id', { plateNumber: '123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if plate already exists on another vehicle', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'id' }); // existing vehicle
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'otherId' }); // duplicate plate

      await expect(
        service.updateVehicle('id', { plateNumber: '123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should update vehicle successfully', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ id: 'id' });
      (cloudinary.uploadFile as jest.Mock).mockResolvedValue({ secure_url: 'http://new.image' });
      (prisma.vehicle.update as jest.Mock).mockResolvedValue({ id: 'id', plateNumber: '123' });

      const result = await service.updateVehicle('id', { plateNumber: '123' }, {} as any);

      expect(result).toEqual({ id: 'id', plateNumber: '123' });
      expect(prisma.vehicle.update).toHaveBeenCalled();
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle successfully', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ id: 'id' });
      (prisma.vehicle.delete as jest.Mock).mockResolvedValue({ id: 'id' });

      const result = await service.deleteVehicle('id');

      expect(result).toEqual({ message: 'Vehicle deleted successfully' });
    });
  });
});