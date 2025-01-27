import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
  ) { }

  async create(cityData: City): Promise<any> {
    try {
      if (cityData) {
        const newDepartment = this.cityRepository.create({
          ...cityData,
        });

        const createdDepartment = await this.cityRepository.save(newDepartment);

        if (createdDepartment) {
          return ResponseUtil.success(
            200,
            'Ciudad creada exitosamente',
            createdDepartment
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Ciudad'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Ciudad'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const cities = await this.cityRepository.find({
        where: { estado: 1 },
      });

      if (cities.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrada Ciudades'
        );
      }

      return ResponseUtil.success(
        200,
        'Ciudades encontradas',
        cities
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Ciudades',
        error.message
      );
    }
  }

  async findOne(id: number) {
    try {
      const department = await this.cityRepository.findOne({
        where: { id_ciudad: id },
      });

      if (department) {
        return ResponseUtil.success(
          200,
          'Ciudad encontrada',
          department
        );
      } else {
        return ResponseUtil.error(
          404,
          'Ciudad no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Ciudad'
      );
    }
  }

  async update(id, cityData) {
    try {
      const existingDepartment = await this.cityRepository.findOne({
        where: { id_ciudad: id },
      });

      if (!existingDepartment) {
        throw new NotFoundException('Ciudad no encontrada');
      }

      const updatedDepartment = await this.cityRepository.save({
        ...existingDepartment,
        ...cityData,
      });

      return ResponseUtil.success(
        200,
        'Ciudad actualizada exitosamente',
        updatedDepartment
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Ciudad no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Ciudad'
      );
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existingDepartment = await this.cityRepository.findOne({
        where: { id_ciudad: id },
      });

      if (!existingDepartment) {
        return ResponseUtil.error(404, 'Ciudad no encontrada');
      }

      existingDepartment.estado = 0;
      const updatedDepartment = await this.cityRepository.save(existingDepartment);

      if (updatedDepartment) {
        return ResponseUtil.success(
          200,
          'Ciudad eliminado exitosamente',
          updatedDepartment
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Ciudad'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Ciudad'
      );
    }
  }
}
