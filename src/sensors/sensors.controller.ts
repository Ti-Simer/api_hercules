import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { Sensor } from './entities/sensor.entity';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get('all')
  async findAll(): Promise<Sensor[]> {
    return this.sensorsService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.sensorsService.findOne(id);
  }

  @Post('create')
  async create(@Body() sensorData: Sensor): Promise<Sensor> {
    return this.sensorsService.create(sensorData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() sensorData: Sensor): Promise<any> {
    return this.sensorsService.update(id, sensorData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.sensorsService.remove(id);
  }

  /////////////////////////////////////////////////////////////////////////////////////////

  @Get('findByDevice/:id')
  async findByDevice(@Param('id') id_device: number): Promise<Sensor[]> {
    return this.sensorsService.findByDevice(id_device);
  }
}
