import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createGr(data: CreateGroupDto) {
    try {
      let { userId, ...rest} = data
      let gr = await this.prisma.group.create({
        data: {...rest}
      });

      let join = await this.joinGr({
        userId: data.userId,
        groupId: gr.id
      })

      return {
        CreatedGr: gr,
        joined: join
      };
    } catch (error) {
      return error.message;
    }
  }

  async searchGr(name: string){
    try {
      const filter:any = {}
      if(name){
        filter.name = {contains: name, mode: "insensetive"}
      }
      let grs = await this.prisma.group.findMany({
        where: filter
      })
      return grs
    } catch (error) {
      return error
    }
  }

  async getAll(){
    try {
      console.log("kiridii");
      
      let groups = await this.prisma.group.findMany({include: {users: true}})
      return groups
    } catch (error) {
      return error.message
    }
  }
  async getGr(myId: string) {
    try {
      let myGr = await this.prisma.group.findMany({
        where: {
          users: {
            some: {
              id: myId
            }
          }
        }
      });
      return myGr;
    } catch (error) {
      return error.message;
    }
  }

  async joinGr(data: { groupId: string, userId: string }) {
    try {
      let joined = await this.prisma.user.update({
        where: {
          id: data.userId
        },
        data: {
          group: { connect: [{ id: data.groupId }] }
        }
      });
      return joined;
    } catch (error) {
      return error.message;
    }
  }

  async messageCreate(data: any) {
    try {
      let message = await this.prisma.groupMessage.create({ data });
      return message;
    } catch (error) {
      return error.message;
    }
  }

  async messageGet(groupId: string) {
    try {
      let message = await this.prisma.groupMessage.findMany({
        where: {
          groupId
        }
      });
      return message;
    } catch (error) {
      return error.message;
    }
  }
}