import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from './services/login.service';
import { LoginController } from './controllers/login.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your_jwt_secret', // Replace with environment variable in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    { provide: 'ILoginService', useClass: LoginService },
  ],
  controllers: [LoginController],
})
export class LoginModule {}