import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { Sensor } from './entities/sensor.entity';

@Injectable()
export class SensorsService {
    constructor(
      @InjectRepository(Sensor) private sensorRepository: Repository<Sensor>,
    ) { }
  
    async create(sensorData: Sensor): Promise<any> {
      try {
        if (sensorData) {
          const newSensor = this.sensorRepository.create({
            ...sensorData,
          });
  
          const createdSensor = await this.sensorRepository.save(newSensor);
  
          if (createdSensor) {
            return ResponseUtil.success(
              200,
              'Sensor creada exitosamente',
              createdSensor
            );
          } else {
            return ResponseUtil.error(
              500,
              'Ha ocurrido un problema al crear el Sensor'
            );
          }
        }
      } catch (error) {
        return ResponseUtil.error(
          500,
          'Error al crear el Sensor'
        );
      }
    }
  
    async findAll(): Promise<any> {
      try {
        const sensors = await this.sensorRepository.find({
          where: { estado: 1 },
        });
  
        if (sensors.length < 1) {
          return ResponseUtil.error(
            400,
            'No se han encontrado Sensores'
          );
        }
  
        return ResponseUtil.success(
          200,
          'Sensores encontrados',
          sensors
        );
      } catch (error) {
        return ResponseUtil.error(
          500,
          'Error al obtener los Sensores',
          error.message
        );
      }
    }
  
    async findOne(id: number) {
      try {
        const sensor = await this.sensorRepository.findOne({
          where: { id_sensor: id },
        });
  
        if (sensor) {
          return ResponseUtil.success(
            200,
            'Sensor encontrado',
            sensor
          );
        } else {
          return ResponseUtil.error(
            404,
            'Sensor no encontrado'
          );
        }
      } catch (error) {
        return ResponseUtil.error(
          500,
          'Error al obtener el Sensor'
        );
      }
    }
  
    async update(id, sensorData) {
      try {
        const existingSensor = await this.sensorRepository.findOne({
          where: { id_sensor: id },
        });
  
        if (!existingSensor) {
          throw new NotFoundException('Sensor no encontrado');
        }
  
        const updatedSensor = await this.sensorRepository.save({
          ...existingSensor,
          ...sensorData,
        });
  
        return ResponseUtil.success(
          200,
          'Sensor actualizada exitosamente',
          updatedSensor
        );
      } catch (error) {
        if (error instanceof NotFoundException) {
          return ResponseUtil.error(
            404,
            'Sensor no encontrado'
          );
        }
        return ResponseUtil.error(
          500,
          'Error al actualizar el Sensor'
        );
      }
    }
  
    async remove(id: number): Promise<any> {
      try {
        const existingSensor = await this.sensorRepository.findOne({
          where: { id_sensor: id },
        });
  
        if (!existingSensor) {
          return ResponseUtil.error(404, 'Sensor no encontrado');
        }
  
        existingSensor.estado = 0;
        const updatedSensor = await this.sensorRepository.save(existingSensor);
  
        if (updatedSensor) {
          return ResponseUtil.success(
            200,
            'Sensor eliminado exitosamente',
            updatedSensor
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al eliminar el Sensor'
          );
        }
      } catch (error) {
        return ResponseUtil.error(
          500,
          'Error al eliminar el Sensor'
        );
      }
    }

    ////////////////////////////////////////////////////////////////////////////////

    async findByDevice(id_device: number): Promise<any> {
      try {
        const sensors = await this.sensorRepository.find({
          where: { id_device: id_device },
        });
  
        if (sensors.length < 1) {
          return ResponseUtil.error(
            400,
            'No se han encontrado Sensores'
          );
        }
  
        return ResponseUtil.success(
          200,
          'Sensores encontrados',
          sensors
        );
      } catch (error) {
        return ResponseUtil.error(
          500,
          'Error al obtener los Sensores',
          error.message
        );
      }
    }
}
