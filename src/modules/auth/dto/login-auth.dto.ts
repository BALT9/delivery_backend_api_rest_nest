import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class LoginAuthDto {

    @ApiProperty({
        example: 'admin@gmail.com',
        description: 'Correo del usuario',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
        minLength: 6,
        maxLength: 250,
    })
    @MinLength(6)
    @MaxLength(250)
    @IsNotEmpty()
    password: string;
}