import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone]), // Importar si se utiliza TypeORM
  ],
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule {}
