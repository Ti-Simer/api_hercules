import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';
import { ZonesModule } from './zones/zones.module';
import { BranchOfficesModule } from './branch-offices/branch-offices.module';
import { DevicesModule } from './devices/devices.module';
import { ResDataModule } from './res_data/res_data.module';
import { SensorsModule } from './sensors/sensors.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'hercules_montagas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta a las entidades
      synchronize: false,
    }),
    UsersModule,
    CitiesModule,
    ZonesModule,
    BranchOfficesModule,
    DevicesModule,
    ResDataModule,
    SensorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

