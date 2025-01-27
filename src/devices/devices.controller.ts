import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('all')
  async findAll(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.devicesService.findOne(id);
  }

  @Post('create')
  async create(@Body() deviceData: Device): Promise<Device> {
    return this.devicesService.create(deviceData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() deviceData: Device): Promise<any> {
    return this.devicesService.update(id, deviceData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.devicesService.remove(id);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  @Get('findByBranchOffice/:id')
  async findByBranchOffice(@Param('id') id_sucursal: number): Promise<Device[]> {
    return this.devicesService.findByBranchOffice(id_sucursal);
  }
}
