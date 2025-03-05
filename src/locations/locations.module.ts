import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './entities/location.entity';
import { Device } from 'src/devices/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Device]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule { }
