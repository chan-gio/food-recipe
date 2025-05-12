import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { CloudinaryProvider } from 'src/common/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IUserService', useClass: UserService },
    CloudinaryProvider,
  ],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}