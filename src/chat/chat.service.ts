import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createChat(data: CreateChatDto) {
    try {
      let chat = await this.prisma.chat.create({data})
      return chat
    } catch (error) {
      return error.message
    }
  }

  async getChat(myId: string){
    console.log(myId);
    
    let chat = await this.prisma.chat.findMany({
      where: { 
        OR: [
          {fromId: myId},
          {toId: myId}
        ]
      },
      include: {
        from: true,
        to: true
      }
    })

    return chat
  }

  async deleteChat(id: string) {
    try {
      let chat = await this.prisma.chat.delete({ where: {id}})
      return chat
    } catch (error) {
      return error.message
    }
  }

  async getMessages(chatId: string){
    try {
      let messages = await this.prisma.message.findMany({
        where: {
          chatId
        }
      })
  
      return messages
    } catch (error) {
      return error.message
    }
  }

  async createMessage(data: CreateMessageDto){
    try {
      let message = await this.prisma.message.create({
        data
      })
      return message
    } catch (error) {
      return error.message
    }
  }

  async deleteMessage(id: string){
    try {
      let deleted_Message = await this.prisma.message.delete({where: {id}})
      return deleted_Message
    } catch (error) {
      return error.message
    }
  }
}
