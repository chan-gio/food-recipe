import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './common/config/database.config';
import { CloudinaryProvider } from './common/config/cloudinary.config';
import { RecipeModule } from './recipe/recipe.module';
import { CategoryModule } from './category/category.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { UserModule } from './user/user.module';
import { InstructionModule } from './instruction/instruction.module';
import { ReviewModule } from './review/review.module';
import { FavoriteModule } from './favorite/favorite.module';
import { SearchesModule } from './searches/searches.module';
import { LoginModule } from './login/login.module';


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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, 
        logging: true,
        retryAttempts: 3, 
        retryDelay: 3000, 
      }),
    }),
    RecipeModule,
    CategoryModule,
    IngredientModule,
    UserModule,
    InstructionModule,
    ReviewModule,
    FavoriteModule,
    SearchesModule,
    LoginModule,
  ],
  providers: [CloudinaryProvider],

})
export class AppModule {}
