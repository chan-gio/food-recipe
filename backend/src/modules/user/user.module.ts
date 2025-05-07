import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, AuthService, UserRepository],
  controllers: [UserController, AuthController],
})
export class UserModule {}
