// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { IUserService } from '../common/interfaces/user.service.interface';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @Inject('IUserService')
//     private readonly userService: IUserService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'your_jwt_secret', // Replace with environment variable
//     });
//   }

//   async validate(payload: any) {
//     const user = await this.userService.getUserById(payload.sub);
//     if (!user) {
//       return null;
//     }
//     return user;
//   }
// }