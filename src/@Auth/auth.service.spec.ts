// Przykłady testów dla Auth

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entities';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('powinno być zdefiniowane', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('powinno zarejestrować nowego użytkownika', async () => {
      const registerDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      // Oczekujemy że metoda register zwróci dane użytkownika
      const result = await service.register(registerDto);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('user');
    });
  });

  describe('login', () => {
    it('powinno zalogować użytkownika i zwrócić token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Oczekujemy że metoda login zwróci token
      const result = await service.login(loginDto);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });
  });
});
