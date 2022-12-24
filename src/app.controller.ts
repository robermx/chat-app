import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService, PusherService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('api')
export class PusherController {
  constructor(private pusherService: PusherService) {}

  @Post('messages')
  async messages(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    await this.pusherService.trigger('chat', 'message', { username, message });
    return [];
  }
}
