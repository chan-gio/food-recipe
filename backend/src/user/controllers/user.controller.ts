import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { IUserService } from '../../common/interfaces/user.service.interface';
import { Response } from '../../common/types/response.type';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService) {}

  @Get()
  async getAllUsers(): Promise<Response<User[]>> {
    const data = await this.userService.findAll();
    return { data, message: 'Users retrieved successfully', code: 200 };
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Response<User>> {
    const data = await this.userService.findById(id);
    if (!data) {
      throw new Error('User not found');
    }
    return { data, message: 'User retrieved successfully', code: 200 };
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const data = await this.userService.register(createUserDto);
    return { data, message: 'User registered successfully', code: 201 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() dto: CreateUserDto): Promise<Response<User>> {
    const data = await this.userService.create(dto);
    return { data, message: 'User created successfully', code: 201 };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<Response<User>> {
    const data = await this.userService.update(id, dto);
    return { data, message: 'User updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.userService.delete(id);
    return { data: null, message: 'User deleted successfully', code: 200 };
  }
}