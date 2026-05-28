import { ApiProperty } from '@nestjs/swagger';

import {
    IsEmail,
    IsEnum,
    IsString,
    MinLength,
} from 'class-validator';

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}

export class CreateUserDto {

    @ApiProperty({
        example: 'Juan Perez',
        description: 'Nombre del usuario',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'juan@gmail.com',
        description: 'Correo electrónico',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        enum: UserRole,
        example: UserRole.CUSTOMER,
        description: 'Rol del usuario',
        required: false,
    })
    @IsEnum(UserRole)
    role?: UserRole;
}