import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { Zone } from './entities/zone.entity';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
  ) { }

  async create(zoneData: Zone): Promise<any> {
    try {
      if (zoneData) {
        const newZone = this.zoneRepository.create({
          ...zoneData,
        });

        const createdZone = await this.zoneRepository.save(newZone);

        if (createdZone) {
          return ResponseUtil.success(
            200,
            'Zona creada exitosamente',
            createdZone
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Zona'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Zona'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const cities = await this.zoneRepository.find({
        where: { estado: 1 },
      });

      if (cities.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrada Zonas'
        );
      }

      return ResponseUtil.success(
        200,
        'Zonas encontradas',
        cities
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Zonas',
        error.message
      );
    }
  }

  async findOne(id: number) {
    try {
      const zone = await this.zoneRepository.findOne({
        where: { id_zona: id },
      });

      if (zone) {
        return ResponseUtil.success(
          200,
          'Zona encontrada',
          zone
        );
      } else {
        return ResponseUtil.error(
          404,
          'Zona no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Zona'
      );
    }
  }

  async update(id, zoneData) {
    try {
      const existingZone = await this.zoneRepository.findOne({
        where: { id_zona: id },
      });

      if (!existingZone) {
        throw new NotFoundException('Zona no encontrada');
      }

      const updatedzone = await this.zoneRepository.save({
        ...existingZone,
        ...zoneData,
      });

      return ResponseUtil.success(
        200,
        'Zona actualizada exitosamente',
        updatedzone
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Zona no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Zona'
      );
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existingZone = await this.zoneRepository.findOne({
        where: { id_zona: id },
      });

      if (!existingZone) {
        return ResponseUtil.error(404, 'Zona no encontrada');
      }

      existingZone.estado = 0;
      const updatedzone = await this.zoneRepository.save(existingZone);

      if (updatedzone) {
        return ResponseUtil.success(
          200,
          'Zona eliminado exitosamente',
          updatedzone
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Zona'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Zona'
      );
    }
  }
}
