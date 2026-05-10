import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entities';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private getUserResponse(user: User) {
    return {
      email: user.email,
      name: user.name,
      isAdmin: user.role === UserRole.ADMIN,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    // Sprawdzenie czy użytkownik istnieje
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email już istnieje');
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    await this.userRepository.save(user);

    return {
      message: 'Użytkownik zarejestrowany pomyślnie',
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: this.getUserResponse(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Szukanie użytkownika
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Nieprawidłowe dane logowania');
    }

    // Porównanie haseł
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidłowe dane logowania');
    }

    // Generowanie JWT tokena
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: this.getUserResponse(user),
    };
  }

  async validateUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie znaleziony');
    }

    return user;
  }
}
