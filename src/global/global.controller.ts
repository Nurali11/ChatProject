import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GlobalService } from './global.service';
import { CreateGlobalDto } from './dto/create-global.dto';

@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Post()
  create(@Body() data: CreateGlobalDto) {
    return this.globalService.create(data);
  }

  @Get()
  findAll() {
    return this.globalService.findAll();
  }
}
