import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City]), // Importar si se utiliza TypeORM
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
