import { Module } from '@nestjs/common';
import { StorageTanksService } from './storage-tanks.service';
import { StorageTanksController } from './storage-tanks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageTank } from './entities/storage-tank.entity';
import { Device } from 'src/devices/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageTank, Device]),
  ],
  controllers: [StorageTanksController],
  providers: [StorageTanksService],
})
export class StorageTanksModule { }
