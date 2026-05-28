import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {

  private blacklistedTokens = new Set<string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {

    try {

      const user = await this.usersService.findOneByEmail(email);

      // Usuario no existe
      if (!user) {
        throw new UnauthorizedException(
          'Usuario no existe',
        );
      }

      // Comparar password encriptado
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Contraseña incorrecta',
        );
      }

      const payload = {
        id: user.id,
        name: user.name,
      };

      return {
        access_token: await this.jwtService.signAsync(
          payload,
        ),

      };

    } catch (error) {

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Error al hacer login',
      );
    }
  }

  // Register
  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Logout
  logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    this.blacklistedTokens.add(token);

    return {
      message: 'Logout exitoso',
    };
  }

  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
