import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController, PusherController } from './app.controller';
import { AppService, PusherService } from './app.service';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Mys0m1sqlMac',
      database: 'nest_auth',
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [AppController, PusherController],
  providers: [AppService, PusherService],
})
export class AppModule {}
