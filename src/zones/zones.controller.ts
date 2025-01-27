import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone.entity';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get('all')
  async findAll(): Promise<Zone[]> {
    return this.zonesService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.zonesService.findOne(id);
  }

  @Post('create')
  async create(@Body() zoneData: Zone): Promise<Zone> {
    return this.zonesService.create(zoneData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() zoneData: Zone): Promise<any> {
    return this.zonesService.update(id, zoneData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.zonesService.remove(id);
  }
}
