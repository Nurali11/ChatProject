// src/user/dto/login-user.dto.ts
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  phone: string;
}
