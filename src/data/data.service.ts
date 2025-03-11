import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Datum } from './entities/datum.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { StorageTank } from 'src/storage-tanks/entities/storage-tank.entity';
import { Device } from 'src/devices/entities/device.entity';
import { Methods } from 'src/data/methods/methods';
import { Location } from 'src/locations/entities/location.entity';

@Injectable()
export class DataService {

  constructor(
    @InjectRepository(Datum) private datumRepository: Repository<Datum>,
    @InjectRepository(StorageTank) private storageTankRepository: Repository<StorageTank>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    private methods: Methods
  ) { }

  async create(datum: any): Promise<any> {
    try {
      if (datum) {
        const parsedData = this.methods.parseTrama(datum.trama);

        console.log('parsedData:', parsedData);

        if (!parsedData) {
          return ResponseUtil.error(400, 'Trama no válida');
        }

        const device = await this.deviceRepository
          .createQueryBuilder('devices')
          .where('devices.imei = :imei', { imei: parsedData.imei })
          .select([
            'devices.id',
            'devices.imei',
          ])
          .getOne();

        const storageTank = await this.storageTankRepository
          .createQueryBuilder('storage_tanks')
          .innerJoinAndSelect('storage_tanks.device', 'device')
          .where('storage_tanks.device = :device', { device: device.id })
          .select([
            'storage_tanks.id',
            'storage_tanks.serial',
            'storage_tanks.aforo',
          ])
          .getOne();

        if (parsedData.level) {
          let actual_data = storageTank.aforo.find(aforo => aforo['Altura mm'] === parsedData.level);

          if (!actual_data) {
            // Encontrar el valor más cercano
            const closestAforo = storageTank.aforo.reduce((prev, curr) => {
              return (Math.abs(curr['Altura mm'] - parsedData.level) < Math.abs(prev['Altura mm'] - parsedData.level) ? curr : prev);
            });

            actual_data = closestAforo;
          }

          parsedData.level = parseFloat(actual_data['Altura mm']);
          parsedData.volume_lt = parseFloat(actual_data['Volumen lt']);
          parsedData.volume_gl = parseFloat(actual_data['Volumen gl']);
          parsedData.percent = parseFloat(actual_data['Porcentaje'].replace(',', '.'));
        }

        const newDatum = this.datumRepository.create({
          ...parsedData
        });

        const createdDatum = await this.datumRepository.save(newDatum);

        return ResponseUtil.success(
          200,
          'Data creada exitosamente',
          createdDatum
        );
      }
    } catch (error) {
      console.error('Error al crear la Data:', error);
      return ResponseUtil.error(500, 'Error al crear la Data');
    }
  }

  async findLatestData() {
    try {
      const data = await this.datumRepository
        .createQueryBuilder('data')
        .where(qb => {
          const subQuery = qb.subQuery()
            .select('MAX(data.create)', 'maxCreate')
            .from(Datum, 'data')
            .groupBy('data.imei')
            .getQuery();
          return 'data.create IN ' + subQuery;
        })
        .getMany();
  
      let response = [];
  
      if (data.length > 1) {
        response = await Promise.all(data.map(async data => {
          const device = await this.deviceRepository
            .createQueryBuilder('devices')
            .where('devices.imei = :imei', { imei: data.imei })
            .leftJoinAndSelect('devices.location', 'location')
            .leftJoinAndSelect('location.children', 'child')
            .leftJoinAndSelect('location.parent_id', 'parent')
            .select([
              'devices.id',
              'devices.imei',
              'devices.state',
              'location.id',
              'location.name',
              'location.state',
              'child.id',
              'child.name',
              'child.state',
              'parent.id',
              'parent.name',
              'parent.state',
            ])
            .getOne();
    
          return {
            device,
            data
          };
        }));
      }
  
      if (data.length < 1) {
        return ResponseUtil.error(
          404,
          'Data no encontrada'
        );
      }
  
      return ResponseUtil.success(
        200,
        'Data encontrada',
        response
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Data',
        error.message
      );
    }
  }

  async findLatestDataByImei(imei: string) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Obtener solo la parte de la fecha

    try {
      const data = await this.datumRepository
        .createQueryBuilder('data')
        .where('DATE(data.create) = :today', { today: todayString })
        .andWhere('data.imei = :imei', { imei })
        .getOne();

      if (!data) {
        return ResponseUtil.error(
          404,
          'Data no encontrada'
        );
      }

      if (data) {
        const device = await this.deviceRepository
          .createQueryBuilder('devices')
          .where('devices.imei = :imei', { imei })
          .leftJoinAndSelect('devices.location', 'location')
          .leftJoinAndSelect('location.children', 'child')
          .leftJoinAndSelect('location.parent_id', 'parent')
          .getOne();

        const response = {
          device,
          data
        };

        return ResponseUtil.success(
          200,
          'Data encontrada',
          response
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Data',
        error.message
      );
    }
  }

  async findDataByImei(imei: string) {
    try {
      if (imei) {
        const device = await this.deviceRepository
          .createQueryBuilder('devices')
          .where('devices.imei = :imei', { imei })
          .leftJoinAndSelect('devices.location', 'location')
          .leftJoinAndSelect('location.children', 'child')
          .leftJoinAndSelect('location.parent_id', 'parent')
          .getOne();

        const storage_tank = await this.storageTankRepository
          .createQueryBuilder('storage_tanks')
          .where('storage_tanks.device = :device', { device: device.id })
          .getOne();

        const response = {
          device,
          storage_tank,
        };

        return ResponseUtil.success(
          200,
          'Data encontrada',
          response
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Data',
        error.message
      );
    }
  }

  async findDataByLocality(id: string) {
    try {
      if (id) {
        const location = await this.locationRepository
          .createQueryBuilder('location')
          .leftJoinAndSelect('location.children', 'child')
          .leftJoinAndSelect('location.parent_id', 'parent')
          .where('location.id = :id', { id })
          .getOne();

        return ResponseUtil.success(
          200,
          'Data encontrada',
          location
        );
      }
    } catch (error) {
      console.error('Error al obtener la Data:', error);
      return ResponseUtil.error(
        500,
        'Error al obtener la Data',
        error.message
      );
    }
  }

  // async findAll(): Promise<any> {
  //   try {
  //     const locations = await this.datumRepository
  //       .createQueryBuilder('location')
  //       .leftJoinAndSelect('location.children', 'child')
  //       .leftJoinAndSelect('location.parent_id', 'parent')
  //       .getMany();

  //     if (locations.length < 1) {
  //       return ResponseUtil.error(
  //         400,
  //         'No se han encontrado Ubicaciones'
  //       );
  //     }

  //     return ResponseUtil.success(
  //       200, 'Ubicaciones encontradas',
  //       locations
  //     );
  //   } catch (error) {
  //     return ResponseUtil.error(
  //       500,
  //       'Error al obtener las Ubicaciones'
  //     );
  //   }
  // }

  // async findOne(id: string) {
  //   try {
  //     const city = await this.datumRepository
  //       .createQueryBuilder('location')
  //       .leftJoinAndSelect('location.children', 'child')
  //       .leftJoinAndSelect('location.parent_id', 'parent')
  //       .where('location.id = :id', { id })
  //       .orWhere('location.name = :name', { name: id })
  //       .getOne();

  //     if (city) {
  //       return ResponseUtil.success(
  //         200,
  //         'Ciudad encontrada',
  //         city
  //       );
  //     } else {
  //       return ResponseUtil.error(
  //         404,
  //         'Ciudad no encontrada'
  //       );
  //     }
  //   } catch (error) {
  //     return ResponseUtil.error(
  //       500,
  //       'Error al obtener la Ciudad'
  //     );
  //   }
  // }

  // async update(id, datum) {
  //   try {

  //     const existingLocation = await this.datumRepository
  //       .createQueryBuilder('location')
  //       .where('location.id = :id', { id })
  //       .orWhere('location.name = :name', { name: id })
  //       .getOne();

  //     if (!existingLocation) {
  //       return ResponseUtil.error(
  //         400,
  //         'Ciudad no encontrada'
  //       );
  //     }

  //     const updatedCity = await this.datumRepository.save({
  //       ...existingLocation,
  //       ...datum,
  //     });

  //     if (updatedCity) {
  //       return ResponseUtil.success(
  //         200,
  //         'Ciudad actualizada exitosamente',
  //         updatedCity
  //       );
  //     }

  //   } catch (error) {
  //     return ResponseUtil.error(
  //       404,
  //       'Ciudad no encontrada'
  //     );
  //   }
  // }

  // async remove(id: string): Promise<any> {
  //   try {
  //     const existingLocation = await this.datumRepository
  //       .createQueryBuilder('location')
  //       .where('location.id = :id', { id })
  //       .orWhere('location.name = :name', { name: id })
  //       .getOne();

  //     if (!existingLocation) {
  //       return ResponseUtil.error(404, 'Ciudad no encontrada');
  //     }

  //     existingLocation.state = 0;
  //     const updatedCity = await this.datumRepository.save(existingLocation);

  //     if (updatedCity) {
  //       return ResponseUtil.success(
  //         200,
  //         'Ciudad eliminada exitosamente',
  //         updatedCity
  //       );
  //     } else {
  //       return ResponseUtil.error(
  //         500,
  //         'Ha ocurrido un problema al eliminar la Ciudad'
  //       );
  //     }
  //   } catch (error) {
  //     return ResponseUtil.error(
  //       500,
  //       'Error al eliminar la Ciudad'
  //     );
  //   }
  // }

  // async activate(id: string): Promise<any> {
  //   try {
  //     const existingLocation = await this.datumRepository
  //       .createQueryBuilder('location')
  //       .where('location.id = :id', { id })
  //       .orWhere('location.name = :name', { name: id })
  //       .getOne();

  //     if (!existingLocation) {
  //       return ResponseUtil.error(404, 'Ciudad no encontrada');
  //     }

  //     existingLocation.state = 1;
  //     const updatedCity = await this.datumRepository.save(existingLocation);

  //     if (updatedCity) {
  //       return ResponseUtil.success(
  //         200,
  //         'Ciudad eliminada exitosamente',
  //         updatedCity
  //       );
  //     } else {
  //       return ResponseUtil.error(
  //         500,
  //         'Ha ocurrido un problema al eliminar la Ciudad'
  //       );
  //     }
  //   } catch (error) {
  //     return ResponseUtil.error(
  //       500,
  //       'Error al eliminar la Ciudad'
  //     );
  //   }
  // }
}
