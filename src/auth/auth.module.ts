import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialPermissionsController } from './auth.InitialPermissionsController';
import { Roles } from '../roles/entities/roles.entity';
import { Permissions } from '../permissions/entities/permission.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Permissions,
      Roles,
    ]),
  ],
  controllers: [
    InitialPermissionsController
  ],
  providers: [AuthService],
})
export class AuthModule {}
