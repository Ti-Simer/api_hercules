import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageTank } from './entities/storage-tank.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'csv-parse/sync';
import { Device } from 'src/devices/entities/device.entity';

@Injectable()
export class StorageTanksService {
  constructor(
    @InjectRepository(StorageTank) private storageTankRepository: Repository<StorageTank>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) { }

  async create(storageTankData: StorageTank): Promise<any> {
    try {
      if (storageTankData) {

        // Verificar si ya existe una Tanque de almacenamiento con el mismo nombre
        const existingStorageTank = await this.storageTankRepository.findOne({
          where: { serial: storageTankData.serial },
        });
        if (existingStorageTank) {
          return ResponseUtil.error(400, 'El Tanque de almacenamiento ya existe');
        }

        // Si se envía location, verificar que El Tanque de almacenamiento padre exista
        if (storageTankData.device) {
          const device = await this.deviceRepository.findOne({
            where: { id: storageTankData.device.toString() },
          });

          if (!device) {
            return ResponseUtil.error(
              400,
              'El dispositivo especificado no existe'
            );
          }
        }

        if (storageTankData.aforo) {
          try {
            let parsedAforoData;
            parsedAforoData = parse(storageTankData.aforo, {
              columns: true,
              skip_empty_lines: true,
              delimiter: ';' // Especificar el delimitador correcto
            });
            storageTankData.aforo = parsedAforoData;
          } catch (error) {
            console.error('Error parsing aforo_data:', error);
            return ResponseUtil.error(400, 'El campo aforo no es un CSV válido');
          }
        }

        // Crear la nueva Tanque de almacenamiento, incluyendo el parent_id si se proporcionó
        const newStorageTank = this.storageTankRepository.create({
          ...storageTankData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 1,
        });

        const createdStorageTank = await this.storageTankRepository.save(newStorageTank);

        if (createdStorageTank) {

          return ResponseUtil.success(
            200,
            'Tanque de almacenamiento creado exitosamente',
            {
              serial: createdStorageTank.serial,
              state: createdStorageTank.state,
            }
          );

        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear El Tanque de almacenamiento'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear El Tanque de almacenamiento',
        error.message
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const storageTanks = await this.storageTankRepository
        .createQueryBuilder('storage_tanks')
        .innerJoinAndSelect('storage_tanks.device', 'device')
        .innerJoinAndSelect('device.location', 'location')
        .leftJoinAndSelect('location.children', 'child')
        .leftJoinAndSelect('location.parent_id', 'parent')
        .select([
          'storage_tanks.id',
          'storage_tanks.serial',
          'storage_tanks.state',
          'storage_tanks.update',
          'device.id',
          'device.imei',
          'device.state',
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
        .getMany();

      if (storageTanks.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Tanques de almacenamiento'
        );
      }

      return ResponseUtil.success(
        200,
        'Tanques de almacenamiento encontrados exitosamente',
        storageTanks
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Tanques de almacenamiento',
        error.message
      );
    }
  }

  async findOne(id: string) {
    try {
      const storageTanks = await this.storageTankRepository
        .createQueryBuilder('storage_tanks')
        .innerJoinAndSelect('storage_tanks.device', 'device')
        .innerJoinAndSelect('device.location', 'location')
        .leftJoinAndSelect('location.children', 'child')
        .leftJoinAndSelect('location.parent_id', 'parent')
        .select([
          'storage_tanks.id',
          'storage_tanks.serial',
          'storage_tanks.aforo',
          'storage_tanks.state',
          'storage_tanks.update',
          'device.id',
          'device.imei',
          'device.state',
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
        .where('storage_tanks.id = :id', { id })
        .orWhere('storage_tanks.serial = :id', { id })
        .getOne();

      if (storageTanks) {
        return ResponseUtil.success(
          200,
          'Tanque de almacenamiento encontrado',
          storageTanks
        );
      } else {
        return ResponseUtil.error(
          404,
          'Tanque de almacenamiento no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Tanque de almacenamiento'
      );
    }
  }

  async update(id, storageTankData) {
    try {
      const existingStorageTank = await this.storageTankRepository
        .createQueryBuilder('storage_tanks')
        .where('storage_tanks.id = :id', { id })
        .orWhere('storage_tanks.serial = :id', { id })
        .getOne();

      if (!existingStorageTank) {
        return ResponseUtil.error(
          400,
          'Tanque de almacenamiento no encontrado'
        );
      }

      if (storageTankData.level) {
        let actual_data = existingStorageTank.aforo.find(aforo => aforo['Altura mm'] === storageTankData.level);

        if (!actual_data) {
          // Encontrar el valor más cercano
          const closestAforo = existingStorageTank.aforo.reduce((prev, curr) => {
            return (Math.abs(curr['Altura mm'] - storageTankData.level) < Math.abs(prev['Altura mm'] - storageTankData.level) ? curr : prev);
          });

          actual_data = closestAforo;
        }

        storageTankData.actual_data = actual_data;
      }

      const updatedStorageTank = await this.storageTankRepository.save({
        ...existingStorageTank,
        ...storageTankData,
      });

      if (updatedStorageTank) {
        return ResponseUtil.success(
          200,
          'Tanque de almacenamiento actualizado exitosamente',
          {
            "serial": updatedStorageTank.serial,
            "state": updatedStorageTank.state,
            "level": updatedStorageTank.level,
            "actual_data": updatedStorageTank.actual_data,
            "update": updatedStorageTank.update,
          }
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Tanque de almacenamiento no encontrado'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingStorageTank = await this.storageTankRepository
        .createQueryBuilder('storage_tanks')
        .select([
          'storage_tanks.id',
          'storage_tanks.serial',
          'storage_tanks.state',
        ])
        .where('storage_tanks.id = :id', { id })
        .orWhere('storage_tanks.serial = :id', { id })
        .getOne();

      if (!existingStorageTank) {
        return ResponseUtil.error(404, 'Tanque de almacenamiento no encontrado');
      }

      existingStorageTank.state = 0;
      const updatedStorageTank = await this.storageTankRepository.save(existingStorageTank);

      if (updatedStorageTank) {
        return ResponseUtil.success(
          200,
          'Tanque de almacenamiento eliminado exitosamente',
          updatedStorageTank
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Tanque de almacenamiento'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Tanque de almacenamiento'
      );
    }
  }

  async activate(id: string): Promise<any> {
    try {
      const existingStorageTank = await this.storageTankRepository
        .createQueryBuilder('storage_tanks')
        .select([
          'storage_tanks.id',
          'storage_tanks.serial',
          'storage_tanks.state',
        ])
        .where('storage_tanks.id = :id', { id })
        .orWhere('storage_tanks.serial = :id', { id })
        .getOne();

      if (!existingStorageTank) {
        return ResponseUtil.error(404, 'Tanque de almacenamiento no encontrado');
      }

      existingStorageTank.state = 1;
      const updatedStorageTank = await this.storageTankRepository.save(existingStorageTank);

      if (updatedStorageTank) {
        return ResponseUtil.success(
          200,
          'Tanque de almacenamiento eliminado exitosamente',
          updatedStorageTank
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Tanque de almacenamiento'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Tanque de almacenamiento'
      );
    }
  }
}
