import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
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

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.appService.findOneBy({ email });
    if (!user) {
      throw new BadRequestException(
        'Invalid credentials - email does not exist',
      );
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials - invalid password');
    }

    return user;
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
