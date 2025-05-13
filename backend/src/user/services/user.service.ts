import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { IUserService } from 'src/common/interfaces/user.service.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject("CLOUDINARY")
    private readonly cloudinary: any,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }> {
    return this.userRepository.findAll(paginationDto);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async register(dto: CreateUserDto): Promise<User> {
    const existingByAccount = await this.userRepository.findBySigninAccount(dto.signin_account);
    if (existingByAccount) {
      throw new BadRequestException('Signin account already exists');
    }
    if (dto.email) {
      const existingByEmail = await this.userRepository.findByEmail(dto.email);
      if (existingByEmail) {
        throw new BadRequestException('Email already exists');
      }
    }
  
    // Validate dto.password
    if (!dto.password || typeof dto.password !== 'string' || dto.password.trim() === '') {
      this.logger.error('Password is invalid or missing in CreateUserDto');
      throw new BadRequestException('Password is required and must be a non-empty string');
    }
  
    const saltRounds = 10;
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(dto.password, saltRounds);
      this.logger.log(`Successfully hashed password for user ${dto.signin_account}: ${hashedPassword}`);
    } catch (error) {
      this.logger.error(`Failed to hash password for user ${dto.signin_account}: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to hash password');
    }
  
    const user = {
      signin_account: dto.signin_account,
      password: hashedPassword,
      email: dto.email || null,
      full_name: dto.full_name || null,
      role: dto.role || 'user',
    };
  
    const createdUser = await this.userRepository.create(user);
    this.logger.log(`Created user: ${JSON.stringify(createdUser)}`);
    return createdUser;
  }
  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(id: number, dto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch the existing user
      const existingUser = await queryRunner.manager.query(
        `SELECT * FROM User WHERE user_id = ?`,
        [id],
      );

      if (!existingUser || existingUser.length === 0) {
        throw new BadRequestException('User not found');
      }

      const user = existingUser[0];
      this.logger.log(`Existing user: ${JSON.stringify(user)}`);

      // Handle profile picture upload if a file is provided
      let profilePictureUrl = user.profile_picture;
      if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          throw new BadRequestException('Invalid image type');
        }
        if (file.size > 10000000) {
          throw new BadRequestException('Image size exceeds 10MB');
        }

        const uploadResult = await this.cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'profile_pictures',
            resource_type: 'image',
          },
        );
        profilePictureUrl = uploadResult.secure_url;
        this.logger.log(`Profile picture uploaded: ${profilePictureUrl}`);
      }

      // Hash the password if provided
      let password = user.password;
      if (dto.password) {
        const saltRounds = 10;
        password = await bcrypt.hash(dto.password, saltRounds);
      }

      // Check for unique constraints
      if (dto.signin_account && dto.signin_account !== user.signin_account) {
        const existingByAccount = await queryRunner.manager.query(
          `SELECT * FROM User WHERE signin_account = ? AND user_id != ?`,
          [dto.signin_account, id],
        );
        if (existingByAccount && existingByAccount.length > 0) {
          throw new BadRequestException('Signin account already exists');
        }
      }
      if (dto.email && dto.email !== user.email) {
        const existingByEmail = await queryRunner.manager.query(
          `SELECT * FROM User WHERE email = ? AND user_id != ?`,
          [dto.email, id],
        );
        if (existingByEmail && existingByEmail.length > 0) {
          throw new BadRequestException('Email already exists');
        }
      }

      // Construct the update query
      const updateData: { [key: string]: any } = {};
      const updateParams: any[] = [];
      let updateQuery = `UPDATE User SET `;
      let hasFields = false;

      if (dto.signin_account !== undefined) {
        updateQuery += `signin_account = ?, `;
        updateParams.push(dto.signin_account);
        hasFields = true;
      }
      if (dto.email !== undefined) {
        updateQuery += `email = ?, `;
        updateParams.push(dto.email === '' ? null : dto.email);
        hasFields = true;
      }
      if (dto.full_name !== undefined) {
        updateQuery += `full_name = ?, `;
        updateParams.push(dto.full_name === '' ? null : dto.full_name);
        hasFields = true;
      }
      if (dto.password !== undefined) {
        updateQuery += `password = ?, `;
        updateParams.push(password);
        hasFields = true;
      }
      if (dto.role !== undefined) {
        updateQuery += `role = ?, `;
        updateParams.push(dto.role);
        hasFields = true;
      }
      if (profilePictureUrl !== user.profile_picture) {
        updateQuery += `profile_picture = ?, `;
        updateParams.push(profilePictureUrl);
        hasFields = true;
      }

      if (!hasFields) {
        this.logger.warn(`No fields to update for user ID ${id}`);
        await queryRunner.commitTransaction();
        return user;
      }

      updateQuery = updateQuery.slice(0, -2); // Remove the last comma and space
      updateQuery += ` WHERE user_id = ?`;
      updateParams.push(id);

      this.logger.log(`Executing update query: ${updateQuery} with params: ${JSON.stringify(updateParams)}`);
      await queryRunner.manager.query(updateQuery, updateParams);

      await queryRunner.commitTransaction();

      // Fetch the updated user
      const updatedUser = await this.findById(id);
      if (!updatedUser) {
        throw new BadRequestException('Updated user not found');
      }
      this.logger.log(`User updated successfully: ${JSON.stringify(updatedUser)}`);
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}