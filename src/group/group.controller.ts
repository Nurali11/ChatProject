import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { group } from 'console';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGr(createGroupDto);
  }

  @Post('join')
  joinGr(@Body() data: any){
    return this.groupService.joinGr(data)
  }

  @Get()
  findAll(@Query('myId') myId: string) {
    return this.groupService.getGr(myId);
  }

  @Post('message')
  messageCreate(@Body() data: any){
    return this.groupService.messageCreate(data)
  }

  @Get('message')
  messageGet(@Query('groupId') groupId: string){
    return this.groupService.messageGet(groupId)
  }
}
