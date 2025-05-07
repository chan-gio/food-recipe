import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { IUser } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<IUser> {
    return this.userService.createUser(dto);
  }

  @Get()
  findAll(): Promise<IUser[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<IUser> {
    return this.userService.getUserById(id);
  }

@Get('email/:email')
findOneByEmail(@Param('email') email: string): Promise<IUser> {
    return this.userService.findByEmail(email);
}

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<IUser> {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
