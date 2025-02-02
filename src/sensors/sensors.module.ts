import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entities/sensor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor]), // Importar si se utiliza TypeORM
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
