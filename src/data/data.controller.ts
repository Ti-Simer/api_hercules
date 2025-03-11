import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DataService } from './data.service';
import { Datum } from './entities/datum.entity';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) { }

  @Post('create')
  async create(@Body() datum: Datum): Promise<Datum> {
    return this.dataService.create(datum);
  }

  @Get('findLatestDataByImei/:imei')
  async findLatestDataByImei(@Param('imei') imei: string): Promise<any> {
    return this.dataService.findLatestDataByImei(imei);
  }

  @Get('findDataByImei/:imei')
  async findDataByImei(@Param('imei') imei: string): Promise<any> {
    return this.dataService.findDataByImei(imei);
  }

  @Get('findDataByLocality/:id')
  async findDataByLocality(@Param('id') id: string): Promise<any> {
    return this.dataService.findDataByLocality(id);
  }

  @Get('findLatestData')
  async findLatestData(): Promise<any> {
    return this.dataService.findLatestData();
  }

  // @Get('getById/:id')
  // async findOne(@Param('id') id: string): Promise<any> {
  //   return this.dataService.findOne(id);
  // }


  // @Put('update/:id')
  // async update(@Param('id') id: string, @Body() datum: Datum): Promise<any> {
  //   return this.dataService.update(id, datum);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<any> {
  //   return this.dataService.remove(id);
  // }

  // @Delete('activate/:id')
  // async activate(@Param('id') id: string): Promise<any> {
  //   return this.dataService.activate(id);
  // }
}
