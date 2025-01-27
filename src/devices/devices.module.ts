import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Sensor } from 'src/sensors/entities/sensor.entity';
import { ResDatum } from 'src/res_data/entities/res_datum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Device,
      Sensor,
      ResDatum
    ]), // Importar si se utiliza TypeORM
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
