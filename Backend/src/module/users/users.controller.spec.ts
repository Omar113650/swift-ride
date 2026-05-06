import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';

describe('UserController', () => {
  let controller: UserController;

  // ================= MOCK SERVICE =================
  const userServiceMock = {
    Register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    GetProfile: jest.fn(),
    refreshToken: jest.fn(),
    googleLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);

    jest.clearAllMocks();
  });

  // ================= REGISTER =================
  it('should call register service', async () => {
    userServiceMock.Register.mockResolvedValue({
      message: 'ok',
      user: { id: 1 },
    });

    const res = await controller.register(
      { email: 'test@test.com' } as any,
      {} as any,
    );

    expect(res).toBeDefined();
    expect(userServiceMock.Register).toHaveBeenCalled();
  });

  // ================= LOGIN =================
  it('should call login service', async () => {
    userServiceMock.login.mockResolvedValue({
      user: { id: 1 },
    });

    const res = await controller.login(
      { email: 'test@test.com' } as any,
      {} as any,
    );

    expect(res).toBeDefined();
    expect(userServiceMock.login).toHaveBeenCalled();
  });

  // ================= LOGOUT =================
  it('should call logout service', async () => {
    userServiceMock.logout.mockResolvedValue({
      message: 'logged out',
    });

    const res = await controller.logout({} as any);

    expect(res).toBeDefined();
    expect(userServiceMock.logout).toHaveBeenCalled();
  });

  // ================= GET USERS =================
  it('should call GetProfile service', async () => {
    userServiceMock.GetProfile.mockResolvedValue([{ id: 1 }]);

    const res = await controller.findUser();

    expect(res).toBeDefined();
    expect(userServiceMock.GetProfile).toHaveBeenCalled();
  });

  // ================= GOOGLE CALLBACK =================
  it('should call googleLogin service', async () => {
    userServiceMock.googleLogin.mockResolvedValue({
      user: { id: 1 },
    });

    const res = await controller.googleCallback({
      user: { googleId: '123' },
    } as any);

    expect(res).toBeDefined();
    expect(userServiceMock.googleLogin).toHaveBeenCalled();
  });
});