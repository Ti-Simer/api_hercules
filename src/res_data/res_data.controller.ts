import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ResDataService } from './res_data.service';
import { ResDatum } from './entities/res_datum.entity';

@Controller('res-data')
export class ResDataController {
  constructor(private readonly resDataService: ResDataService) {}

  @Get('all')
  async findAll(): Promise<ResDatum[]> {
    return this.resDataService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.resDataService.findOne(id);
  }

  @Post('create')
  async create(@Body() res_data: ResDatum): Promise<ResDatum> {
    return this.resDataService.create(res_data);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() res_data: ResDatum): Promise<any> {
    return this.resDataService.update(id, res_data);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////

  @Get('findByDevice/:id')
  async findByDevice(@Param('id') id_device: number): Promise<ResDatum[]> {
    return this.resDataService.findByDevice(id_device);
  }

  @Post('findBySensor')
  async findBySensor(@Body() sensor_data: any): Promise<ResDatum[]> {
    return this.resDataService.findBySensor(sensor_data);
  }

}
