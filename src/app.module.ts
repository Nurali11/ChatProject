import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [ChatModule, PrismaModule, UserModule, GroupModule, GlobalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
