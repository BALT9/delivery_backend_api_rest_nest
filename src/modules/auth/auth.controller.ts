import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    // REGISTER
    @Post('register')
    register(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.authService.register(
            createUserDto,
        );
    }

    // LOGIN
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(
        @Body() loginAuthDto: LoginAuthDto,
    ) {
        return this.authService.signIn(
            loginAuthDto.email,
            loginAuthDto.password,
        );
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return this.authService.findProfile(req.user.id);
    }

    // Logout
    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Request() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return this.authService.logout(token);
    }


}