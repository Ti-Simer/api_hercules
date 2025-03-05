import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datum } from './entities/datum.entity';
import { StorageTank } from 'src/storage-tanks/entities/storage-tank.entity';
import { Device } from 'src/devices/entities/device.entity';
import { Methods } from './methods/methods';

@Module({
  imports: [
    TypeOrmModule.forFeature([Datum, StorageTank, Device]),
  ],
  controllers: [DataController],
  providers: [DataService, Methods],
})
export class DataModule {}
