import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
@UseInterceptors(FileInterceptor('photo', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4();
      const extension = extname(file.originalname);
      callback(null, `${uniqueSuffix}${extension}`);
    }
  })
}))
async register(
  @Body() createUserDto: CreateUserDto,
  @UploadedFile() photo: Express.Multer.File,
) {
  if (photo) {
    createUserDto.photo = `uploads/${photo.filename}`;
  }
  return this.userService.register(createUserDto);
}


  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  async findAll(@Query('userName') name: string){
    return this.userService.findAll(name)
  }
}
