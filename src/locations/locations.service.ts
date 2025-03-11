import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Location } from './entities/location.entity';
import { Device } from 'src/devices/entities/device.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) { }

  async create(locationData: Location): Promise<any> {
    try {
      if (locationData) {

        // Verificar si ya existe una ubicación con el mismo nombre
        const existingLocation = await this.locationRepository.findOne({
          where: { name: locationData.name },
        });
        if (existingLocation) {
          return ResponseUtil.error(400, 'La Ubicación ya existe');
        }

        // Si se envía parent_id, verificar que la ubicación padre exista
        if (locationData.parent_id) {
          const parentLocation = await this.locationRepository
            .createQueryBuilder('location')
            .where('location.id = :id', { id: locationData.parent_id.toString() })
            .orWhere('location.name = :name', { name: locationData.parent_id.toString() })
            .getOne();

          if (!parentLocation) {
            return ResponseUtil.error(
              400,
              'La Ubicación padre especificada no existe'
            );
          }

          locationData.parent_id = parentLocation;
        }

        // Crear la nueva ubicación, incluyendo el parent_id si se proporcionó
        const newLocation = this.locationRepository.create({
          ...locationData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 1,
        });

        const createdLocation = await this.locationRepository.save(newLocation);

        if (createdLocation) {
          return ResponseUtil.success(
            200,
            'Ubicación creada exitosamente',
            createdLocation
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Ubicación'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(500, 'Error al crear la Ubicación');
    }
  }

  async findAll(): Promise<any> {
    try {
      const locations = await this.locationRepository
        .createQueryBuilder('location')
        .leftJoinAndSelect('location.children', 'child')
        .leftJoinAndSelect('location.parent_id', 'parent')
        .getMany();

      if (locations.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Ubicaciones'
        );
      }

      // Obtener los dispositivos relacionados para cada ubicación
      const locationsWithDevices = await Promise.all(locations.map(async location => {
        const devices = await this.deviceRepository
          .createQueryBuilder('device')
          .where('device.locationId = :locationId', { locationId: location.id })
          .getOne();

        return {
          ...location,
          devices
        };
      }));

      return ResponseUtil.success(
        200,
        'Ubicaciones encontradas',
        locationsWithDevices
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Ubicaciones',
        error.message
      );
    }
  }

  async findOne(id: string) {
    try {
      const city = await this.locationRepository
        .createQueryBuilder('location')
        .leftJoinAndSelect('location.children', 'child')
        .leftJoinAndSelect('location.parent_id', 'parent')
        .where('location.id = :id', { id })
        .orWhere('location.name = :name', { name: id })
        .getOne();

      if (city) {
        return ResponseUtil.success(
          200,
          'Localidad encontrada',
          city
        );
      } else {
        return ResponseUtil.error(
          404,
          'Localidad no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Localidad'
      );
    }
  }

  async update(id, locationData) {
    try {

      const existingLocation = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.id = :id', { id })
        .orWhere('location.name = :name', { name: id })
        .getOne();

      if (!existingLocation) {
        return ResponseUtil.error(
          400,
          'Localidad no encontrada'
        );
      }

      if (locationData.parent_id) {
        const parentLocation = await this.locationRepository
          .createQueryBuilder('location')
          .where('location.id = :id', { id: locationData.parent_id.toString() })
          .orWhere('location.name = :name', { name: locationData.parent_id.toString() })
          .getOne();

        if (!parentLocation) {
          return ResponseUtil.error(
            400,
            'La Ubicación padre especificada no existe'
          );
        }

        locationData.parent_id = parentLocation
      }

      const updatedLocation = await this.locationRepository.save({
        ...existingLocation,
        ...locationData,
      });

      if (updatedLocation) {
        return ResponseUtil.success(
          200,
          'Localidad actualizada exitosamente',
          updatedLocation
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Localidad no encontrada'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingLocation = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.id = :id', { id })
        .orWhere('location.name = :name', { name: id })
        .getOne();

      if (!existingLocation) {
        return ResponseUtil.error(404, 'Localidad no encontrada');
      }

      existingLocation.state = 0;
      const updatedLocation = await this.locationRepository.save(existingLocation);

      if (updatedLocation) {
        return ResponseUtil.success(
          200,
          'Localidad eliminada exitosamente',
          updatedLocation
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Localidad'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Localidad'
      );
    }
  }

  async activate(id: string): Promise<any> {
    try {
      const existingLocation = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.id = :id', { id })
        .orWhere('location.name = :name', { name: id })
        .getOne();

      if (!existingLocation) {
        return ResponseUtil.error(404, 'Localidad no encontrada');
      }

      existingLocation.state = 1;
      const updatedLocation = await this.locationRepository.save(existingLocation);

      if (updatedLocation) {
        return ResponseUtil.success(
          200,
          'Localidad eliminada exitosamente',
          updatedLocation
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Localidad'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Localidad'
      );
    }
  }
}
