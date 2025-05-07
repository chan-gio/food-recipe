import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Searches } from './entities/searches.entity';
import { SearchesRepository } from './repositories/searches.repository';
import { SearchesService } from './services/searches.service';
import { SearchesController } from './controllers/searches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Searches])],
  providers: [
    { provide: 'ISearchesRepository', useClass: SearchesRepository },
    { provide: 'ISearchesService', useClass: SearchesService },
  ],
  controllers: [SearchesController],
})
export class SearchesModule {}