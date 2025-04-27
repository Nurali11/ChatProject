import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { group } from 'console';
import { join } from 'path';

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService
  ){}
  async createGr(data: CreateGroupDto) {
    try {
      let gr = await this.prisma.group.create({data})
      return gr
    } catch (error) {
      return error.message
    }
  }

  async getGr(myId: string){
    try {
      let myGr = await this.prisma.group.findMany({
        where: {
          users: {
            some: {
              id: myId
            }
          }
        }
      })
      return myGr
    } catch (error) {
      return error.message
    }
  }

  async joinGr(data: {groupId: string, userId: string}){
    try {
      let joined = await this.prisma.user.update({
        where: {
          id: data.userId
        },
        data: {
          group: {connect: [{ id: data.groupId}]}
        }
      })
      return joined
    } catch (error) {
      return error.message
    }
  }

  async messageCreate(data: any){
    try {
      let message = await this.prisma.groupMessage.create({data})
      return message
    } catch (error) {
      return error.message
    }
  }

  async messageGet(groupId: string){
    try {
      let message = await this.prisma.groupMessage.findMany({
        where: {
          groupId
        }
      })
      return message
    } catch (error) {
      return error.message
    }
  }


}
