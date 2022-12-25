import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService, PusherService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.appService.create({
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return user;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
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

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'Success',
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      const user = await this.appService.findOneBy({ id: data.id });
      const { password, ...result } = user;

      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
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
