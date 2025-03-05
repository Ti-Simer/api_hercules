import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { StorageTanksModule } from './storage-tanks/storage-tanks.module';
import { DevicesModule } from './devices/devices.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 15,
    }]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'hercules_montagas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta a las entidades
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    LocationsModule,
    StorageTanksModule,
    DevicesModule,
    DataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

