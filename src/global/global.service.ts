import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGlobalDto } from './dto/create-global.dto';
import { UpdateGlobalDto } from './dto/update-global.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GlobalService {
  constructor(
    private prisma: PrismaService
  ) {}
  async create(data: CreateGlobalDto) {
    try {
      let global = await this.prisma.global.create({data})
      return global
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  findAll() {
    try {
      let datas = this.prisma.global.findMany({
        include :{
          from: true
        }
      })
      return datas
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
