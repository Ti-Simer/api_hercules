import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BranchOfficesService } from './branch-offices.service';
import { BranchOffice } from './entities/branch-office.entity';

@Controller('branch-offices')
export class BranchOfficesController {
  constructor(private readonly branchOfficesService: BranchOfficesService) {}

  @Get('all')
  async findAll(): Promise<BranchOffice[]> {
    return this.branchOfficesService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.branchOfficesService.findOne(id);
  }

  @Post('create')
  async create(@Body() branchOfficeData: BranchOffice): Promise<BranchOffice> {
    return this.branchOfficesService.create(branchOfficeData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() branchOfficeData: BranchOffice): Promise<any> {
    return this.branchOfficesService.update(id, branchOfficeData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.branchOfficesService.remove(id);
  }
}
