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

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
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

    // PROFILE
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    // Logout
    @Post('logout')
    logout(@Request() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return this.authService.logout(token);
    }


}