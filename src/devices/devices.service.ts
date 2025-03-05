import { Injectable } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Location } from 'src/locations/entities/location.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Location) private locationRepository: Repository<Location>,
  ) { }

  async create(devicesData: Device): Promise<any> {
    try {
      if (devicesData) {

        // Verificar si ya existe una Dispositivo de comunicación con el mismo nombre
        const existingDevice = await this.deviceRepository.findOne({
          where: { imei: devicesData.imei },
        });
        if (existingDevice) {
          return ResponseUtil.error(400, 'El Dispositivo de comunicación ya existe');
        }

        if (devicesData.location) {
          const location = await this.locationRepository
            .createQueryBuilder('locations')
            .where('locations.id = :id', { id: devicesData.location })
            .orWhere('locations.name = :id', { id: devicesData.location })
            .getOne();

          if (!location) {
            return ResponseUtil.error(
              400,
              'La ubicación especificado no existe'
            );
          }
        }

        // Crear la nueva Dispositivo de comunicación, incluyendo el parent_id si se proporcionó
        const newDevice = this.deviceRepository.create({
          ...devicesData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 1,
        });

        const createdDevice = await this.deviceRepository.save(newDevice);

        if (createdDevice) {

          return ResponseUtil.success(
            200,
            'Dispositivo de comunicación creado exitosamente',
            createdDevice
          );

        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear El Dispositivo de comunicación'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear El Dispositivo de comunicación',
        error.message
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const devices = await this.deviceRepository
        .createQueryBuilder('devices')
        .leftJoinAndSelect('devices.location', 'location')
        .leftJoinAndSelect('location.children', 'child')
        .leftJoinAndSelect('location.parent_id', 'parent')
        .getMany();

      if (devices.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Dispositivos de comunicación'
        );
      }

      return ResponseUtil.success(
        200,
        'Dispositivos de comunicación encontrados exitosamente',
        devices
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Dispositivos de comunicación',
        error.message
      );
    }
  }

  async findOne(id: string) {
    try {
      const devices = await this.deviceRepository
        .createQueryBuilder('devices')
        .leftJoinAndSelect('devices.location', 'location')
        .leftJoinAndSelect('location.children', 'child')
        .leftJoinAndSelect('location.parent_id', 'parent')
        .where('devices.id = :id', { id })
        .orWhere('devices.imei = :id', { id })
        .getOne();

      if (devices) {
        return ResponseUtil.success(
          200,
          'Dispositivo de comunicación encontrado',
          devices
        );
      } else {
        return ResponseUtil.error(
          404,
          'Dispositivo de comunicación no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Dispositivo de comunicación'
      );
    }
  }

  async update(id, devicesData) {
    try {
      const existingDevice = await this.deviceRepository
        .createQueryBuilder('devices')
        .where('devices.id = :id', { id })
        .orWhere('devices.imei = :id', { id })
        .getOne();

      if (!existingDevice) {
        return ResponseUtil.error(
          400,
          'Dispositivo de comunicación no encontrado'
        );
      }

      const updatedDevice = await this.deviceRepository.save({
        ...existingDevice,
        ...devicesData,
      });

      if (updatedDevice) {
        return ResponseUtil.success(
          200,
          'Dispositivo de comunicación actualizado exitosamente',
          updatedDevice
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Dispositivo de comunicación no encontrado'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingDevice = await this.deviceRepository
        .createQueryBuilder('devices')
        .where('devices.id = :id', { id })
        .orWhere('devices.imei = :id', { id })
        .select([
          'devices.id',
          'devices.state',
        ])
        .getOne();

      if (!existingDevice) {
        return ResponseUtil.error(404, 'Dispositivo de comunicación no encontrado');
      }

      existingDevice.state = 0;
      const updatedDevice = await this.deviceRepository.save(existingDevice);

      if (updatedDevice) {
        return ResponseUtil.success(
          200,
          'Dispositivo de comunicación eliminado exitosamente',
          updatedDevice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Dispositivo de comunicación'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Dispositivo de comunicación'
      );
    }
  }

  async activate(id: string): Promise<any> {
    try {
      const existingDevice = await this.deviceRepository
        .createQueryBuilder('devices')
        .where('devices.id = :id', { id })
        .orWhere('devices.imei = :id', { id })
        .select([
          'devices.id',
          'devices.state',
        ])
        .getOne();

      if (!existingDevice) {
        return ResponseUtil.error(404, 'Dispositivo de comunicación no encontrado');
      }

      existingDevice.state = 1;
      const updatedDevice = await this.deviceRepository.save(existingDevice);

      if (updatedDevice) {
        return ResponseUtil.success(
          200,
          'Dispositivo de comunicación eliminado exitosamente',
          updatedDevice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Dispositivo de comunicación'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Dispositivo de comunicación'
      );
    }
  }
}
