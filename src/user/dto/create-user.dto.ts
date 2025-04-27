// src/user/dto/create-user.dto.ts
import { IsNotEmpty, MinLength, IsString, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @MinLength(4)
    userName: string;

    @IsNotEmpty()
    @IsPhoneNumber('UZ')
    phone: string;

    photo: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    userName: string;
}
