import { Module } from '@nestjs/common';
import { AppController, PusherController } from './app.controller';
import { AppService, PusherService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, PusherController],
  providers: [AppService, PusherService],
})
export class AppModule {}
