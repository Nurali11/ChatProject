import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @Get()
  findChats(@Query('myId') myId: string){
    return this.chatService.getChat(myId)
  }
  
  @Post('message')
  createMessage(@Body() data: CreateMessageDto){
    return this.chatService.createMessage(data)
  }

  @Get('message')
  getMessages(@Query('chatId') chatId: string){
    return this.chatService.getMessages(chatId)
  }

  @Delete('message/:id')
  remove(@Param('id') id: string){
    return this.chatService.deleteMessage(id)
  }
}
