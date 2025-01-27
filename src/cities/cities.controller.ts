import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('all')
  async findAll(): Promise<City[]> {
    return this.citiesService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.citiesService.findOne(id);
  }

  @Post('create')
  async create(@Body() cityData: City): Promise<City> {
    return this.citiesService.create(cityData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() cityData: City): Promise<any> {
    return this.citiesService.update(id, cityData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.citiesService.remove(id);
  }
}
