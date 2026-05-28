import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
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
        sub: user.id,
        username: user.name,
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
}
