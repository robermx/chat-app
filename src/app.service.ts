import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Pusher from 'pusher';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(data: any): Promise<User> {
    return this.userRepository.save(data);
  }
}

@Injectable()
export class PusherService {
  pusher: Pusher;
  constructor() {
    this.pusher = new Pusher({
      appId: '1529396',
      key: '6e41731044c1abf63e74',
      secret: '3c1be9b8ad1b1dfd069f',
      cluster: 'us2',
      useTLS: true,
    });
  }
  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
