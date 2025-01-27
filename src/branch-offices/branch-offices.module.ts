import { Module } from '@nestjs/common';
import { BranchOfficesService } from './branch-offices.service';
import { BranchOfficesController } from './branch-offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOffice } from './entities/branch-office.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BranchOffice]), // Importar si se utiliza TypeORM
  ],
  controllers: [BranchOfficesController],
  providers: [BranchOfficesService],
})
export class BranchOfficesModule {}
