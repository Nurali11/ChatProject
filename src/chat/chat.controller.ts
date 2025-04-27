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
  findChats(@Query('myId') myId: string, @Query('fromId') fromId: string, @Query("toId") toId: string){
    return this.chatService.getChat(myId, fromId, toId)
  }
  
  @Post('message')
  createMessage(@Body() data: CreateMessageDto){
    return this.chatService.createMessage(data)
  }

  @Get('private-messages')
  getPrivateMessages(@Query('fromId') fromId: string, @Query("toId") toId: string){
    return this.chatService.getMyMessages(fromId, toId)
  }
  
  @Get('messages')
  getAllMessages(){
    return this.chatService.getAllMessages()
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
