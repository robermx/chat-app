import { Controller, Post, Body } from '@nestjs/common';
import { AppService, PusherService } from './app.service';
import * as bcrypt from 'bcrypt';

@Controller('api')
export class AppController {
  constructor(private appService: AppService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.appService.create({
      name,
      lastname,
      email,
      password: hashedPassword,
    });
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
