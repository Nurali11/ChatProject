import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { group } from 'console';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
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
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFile() photo: Express.Multer.File
  ) {
    if (photo) {
      createGroupDto.photo = `uploads/${photo.filename}`;
    }
    return this.groupService.createGr(createGroupDto);
  }

  @Get('members')
  getMembers(@Query('groupId') groupId: string){
    return this.groupService.groupMembers(groupId)
  }

  @Get('search')
  searchGrs(@Query('name') name: string){
    return this.groupService.searchGr(name)
  }

  @Post('join')
  joinGr(@Body() data: any) {
    return this.groupService.joinGr(data);
  }

  @Get('all')
  getAll(){
    return this.groupService.getAll()
  }

  @Get()
  findAll(@Query('myId') myId: string) {
    return this.groupService.getGr(myId);
  }

  @Post('message')
  messageCreate(@Body() data: any) {
    return this.groupService.messageCreate(data);
  }

  @Get('message')
  messageGet(@Query('groupId') groupId: string) {
    return this.groupService.messageGet(groupId);
  }
}
