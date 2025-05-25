import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Query, Inject, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Response } from '../../common/types/response.type';
import { PaginationDto } from 'src/common/dots/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: UserService) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findAll(@Query() paginationDto: PaginationDto): Promise<Response<User[]>> {
    const { data, total } = await this.userService.findAll(paginationDto);
    return {
      data,
      meta: {
        total,
        page: paginationDto.page ?? 1,
        limit: paginationDto.limit ?? 10,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Users retrieved successfully',
      code: 200,
    };
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async searchByFullNameAndEmail(
    @Query('full_name') full_name: string,
    @Query('email') email: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<Response<User[]>> {
    const { data, total } = await this.userService.searchByFullNameAndEmail(
      full_name,
      email,
      paginationDto,
    );
    return {
      data,
      meta: {
        total,
        page: paginationDto.page ?? 1,
        limit: paginationDto.limit ?? 10,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Users retrieved successfully',
      code: 200,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Response<User | null>> {
    const data = await this.userService.findById(id);
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
  async create(@Body() user: Partial<User>): Promise<Response<User>> {
    const data = await this.userService.create(user);
    return { data, message: 'User created successfully', code: 201 };
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('profile_picture'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedUser = await this.userService.update(parseInt(id), updateUserDto, file);
    return {
      data: updatedUser,
      message: 'User updated successfully',
      code: 200,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.userService.delete(id);
    return { data: null, message: 'User deleted successfully', code: 200 };
  }
}