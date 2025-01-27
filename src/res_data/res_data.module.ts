import { Module } from '@nestjs/common';
import { ResDataService } from './res_data.service';
import { ResDataController } from './res_data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResDatum } from './entities/res_datum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResDatum]), // Importar si se utiliza TypeORM
  ],
  controllers: [ResDataController],
  providers: [ResDataService],
})
export class ResDataModule {}
