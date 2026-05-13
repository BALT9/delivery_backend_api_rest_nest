import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

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
      // console.log('EMAIL:', email);
      // console.log('PASSWORD:', password);

      const user = await this.usersService.findOneByEmail(email);

      console.log('USER:', user);

      // Usuario no existe
      if (!user) {
        throw new UnauthorizedException('Usuario no existe');
      }

      // Contraseña incorrecta
      if (user.password !== password) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const payload = {
        sub: user.id,
        username: user.name,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };

    } catch (error) {
      // console.error('ERROR LOGIN:', error);

      // Si ya es error de auth, lo devolvemos tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Error genérico
      throw new UnauthorizedException('Error al hacer login');
    }
  }
}
