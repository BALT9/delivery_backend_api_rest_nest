// import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto{

    // @ApiProperty({description: 'Ingrese un correo Valido'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // @ApiProperty()
    @MinLength(6)
    @MaxLength(250)
    @IsNotEmpty()
    password: string;
}