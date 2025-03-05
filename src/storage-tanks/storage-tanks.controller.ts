import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StorageTanksService } from './storage-tanks.service';
import { StorageTank } from './entities/storage-tank.entity';

@Controller('storage-tanks')
export class StorageTanksController {
  constructor(private readonly storageTanksService: StorageTanksService) {}

  @Get('all')
  async findAll(): Promise<StorageTank[]> {
    return this.storageTanksService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.storageTanksService.findOne(id);
  }

  @Post('create')
  async create(@Body() storageTankData: StorageTank): Promise<StorageTank> {
    return this.storageTanksService.create(storageTankData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() storageTankData: StorageTank): Promise<any> {
    return this.storageTanksService.update(id, storageTankData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.storageTanksService.remove(id);
  }

  @Delete('activate/:id')
  async activate(@Param('id') id: string): Promise<any> {
    return this.storageTanksService.activate(id);
  }
}
