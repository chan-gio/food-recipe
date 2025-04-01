import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { Recipe } from './modules/recipe/entities/recipe.entity';
import { Category } from './modules/category/entities/category.entity';
import { Ingredient } from './modules/ingredient/entities/ingredient.entity';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module'; 
import { CategoryModule } from './modules/category/category.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Recipe, Category, Ingredient, User],
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
    }),
    CategoryModule,
    IngredientModule,
    RecipeModule,
    UserModule,
  ],
})
export class AppModule {}
