// src/user/user.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { contains } from 'class-validator';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

async register(createUserDto: CreateUserDto) {
  const { name, userName, phone, photo } = createUserDto;

  const existingUser = await this.prisma.user.findFirst({
    where: {
      OR: [
        { userName },
        { phone },
      ],
    },
  });

  if (existingUser) {
    throw new BadRequestException('User with this username or phone already exists');
  }

  const user = await this.prisma.user.create({
    data: {
      name,
      userName,
      phone,
      photo,
    },
  });

  return user;
}


  async login(loginUserDto: LoginUserDto) {
    try {
      const { userName, phone } = loginUserDto;
      
  
      const user = await this.prisma.user.findUnique({
        where: {
          userName,
          phone
        }
      })
  
  
      if (!user) {  
        return {error_message: "User not found"}
      }
    
      return { message: 'Login successful', user};
    } catch (error) {
      return {message: error.message}
    }
    
  }

  async findAll(name: string){
    try {
      const filter:any = {}
      if(name){
        filter.userName = {contains: name, mode: "insensitive"}
      }
      let users = await this.prisma.user.findMany({where: filter})
      return users
    } catch (error) {
      return {message: error.message}
    }
  }
}
