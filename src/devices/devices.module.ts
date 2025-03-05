import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Location } from 'src/locations/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, Location]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
