// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { IUserService } from '../common/interfaces/user.service.interface';
// import { LoginDto } from '../login/dtos/login.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     @Inject('IUserService')
//     private readonly userService: IUserService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async validateUser(signin_account: string, password: string): Promise<any> {
//     const user = await this.userService.getUserBySigninAccount(signin_account);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }

//   async login(dto: LoginDto): Promise<{ access_token: string }> {
//     const user = await this.validateUser(dto.signin_account, dto.password);
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const payload = { sub: user.user_id, username: user.signin_account, role: user.role };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
// }