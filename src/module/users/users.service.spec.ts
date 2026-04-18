import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  //  MOCK PRISMA 
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  //  MOCK JWT 
  const jwtMock = {
    signAsync: jest.fn().mockResolvedValue('fake-token'),
    verify: jest.fn(),
  };

  //  MOCK RESPONSE 
  const resMock = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  //  REGISTER 
  describe('Register', () => {
    it('should create user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      prismaMock.user.create.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
      });

      const result = await service.Register(
        {
          email: 'test@test.com',
          password: '123456',
          name: 'Omar',
          phone: '010',
        } as any,
        resMock as any,
      );

      expect(result).toBeDefined();
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(resMock.cookie).toHaveBeenCalled();
    });
  });

  //  LOGIN 
  describe('login', () => {
    it('should login user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        email: 'test@test.com',
        password: 'hashedPassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(
        {
          email: 'test@test.com',
          password: '123456',
        } as any,
        resMock as any,
      );

      expect(result).toBeDefined();
      expect(resMock.cookie).toHaveBeenCalled();
    });

    it('should throw error if password is wrong', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        email: 'test@test.com',
        password: 'hashedPassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login(
          { email: 'test@test.com', password: 'wrong' } as any,
          resMock as any,
        ),
      ).rejects.toThrow();
    });
  });

  //  GET USERS 
  describe('GetProfile', () => {
    it('should return users list', async () => {
      prismaMock.user.findMany.mockResolvedValue([
        { id: 1, name: 'Omar' },
      ]);

      const result = await service.GetProfile();

      expect(result.length).toBe(1);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
    });
  });
});