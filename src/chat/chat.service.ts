import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { log } from 'console';
import { ChatModule } from './chat.module';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  
  async getAll(){
    try {
      let chats = await this.prisma.chat.findMany()
      return chats
    } catch (error) {
      return {message: error.message}
    }
  }

  async createChat(data: CreateChatDto) {
    try {
        let existingChat = await this.prisma.chat.findFirst({
            where: {
                OR: [
                    { fromId: data.fromId, toId: data.toId },
                    { fromId: data.toId, toId: data.fromId }
                ]
            }
        });

        if (existingChat) {
            return { message: 'Chat already exists' };
        }

        let chat = await this.prisma.chat.create({ data });
        return chat;
    } catch (error) {
        return error.message;
    }
} 
async getChat(myId?: string, fromId?: string, toId?: string) {
  if (fromId && toId) {
    const myChat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { fromId: fromId, toId: toId },
          { fromId: toId, toId: fromId }
        ]
      },
      include: {
        from: true,
        to: true
      }
    });

    return myChat; // <- Вернёт ОДИН чат
  }

  const chats = await this.prisma.chat.findMany({
    where: myId ? {
      OR: [
        { fromId: myId },
        { toId: myId }
      ]
    } : undefined,
    include: {
      from: true,
      to: true
    }
  });

  return chats; // <- Вернёт МАССИВ чатов
}


async getMyMessages(fromId: string, toId: string) {
  try {
    const chat = await this.getChat(undefined, fromId, toId);

    if (!chat || Array.isArray(chat)) {
      return { message: "Chat not found" };
    }

    const messages = await this.prisma.message.findMany({
      where: {
        chatId: chat.id
      },
      include: {
        from: true,
        to: true
      }
    });

    return messages;
  } catch (error) {
    return { message: error.message };
  }
}



  async deleteChat(id: string) {
    try {
      let chat = await this.prisma.chat.delete({ where: {id}})
      return chat
    } catch (error) {
      return error.message
    }
  }

  async getAllMessages(){
    try {
      let messages = await this.prisma.message.findMany()
      return messages
    } catch (error) {
      return {message: error.message}
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
      console.log(data);
      
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
