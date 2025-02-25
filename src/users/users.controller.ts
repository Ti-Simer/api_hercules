import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';
import { Request } from 'express';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(ApiKeyGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('getById/:id')
  async findUserById(@Param('id') id: string): Promise<any> {
    return this.usersService.findUserById(id);
  }

  @Post('create')
  async createUser(@Body() userData: User): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userData: User): Promise<any> {
    return this.usersService.updateUserById(id, userData);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.usersService.deleteUserById(id);
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  @Delete('activate/:id')
  async activateUserById(@Param('id') id: string): Promise<any> {
    return this.usersService.activateUserById(id);
  }

  @Post('login')
  async loginUser(@Req() req: Request, @Body() loginData: { credentials: string; password: string }): Promise<any> {
    const { credentials, password } = loginData;
    return this.usersService.loginUser(req, credentials, password);
  }

  @Post('createMultiple')
  async createMultiple(@Body() userData: User): Promise<User> {
      return this.usersService.createMultiple(userData);
  }
}

