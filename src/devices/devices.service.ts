import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { Device } from './entities/device.entity';
import { Sensor } from 'src/sensors/entities/sensor.entity';
import { ResDatum } from 'src/res_data/entities/res_datum.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Sensor) private sensorRepository: Repository<Sensor>,
    @InjectRepository(ResDatum) private resDataRepository: Repository<ResDatum>,
  ) { }

  async create(deviceData: Device): Promise<any> {
    try {
      if (deviceData) {
        const newDevice = this.deviceRepository.create({
          ...deviceData,
        });

        const createdDevice = await this.deviceRepository.save(newDevice);

        if (createdDevice) {
          return ResponseUtil.success(
            200,
            'Dispositivo creado exitosamente',
            createdDevice
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Dispositivo'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Dispositivo'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const devices = await this.deviceRepository.find({
        where: { estado: 1 },
      });

      if (devices.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Dispositivos'
        );
      }

      return ResponseUtil.success(
        200,
        'Dispositivos encontrados',
        devices
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Dispositivos',
        error.message
      );
    }
  }

  async findOne(id: number) {
    try {
      const device = await this.deviceRepository.findOne({
        where: { id_device: id },
      });

      if (device) {
        return ResponseUtil.success(
          200,
          'Dispositivo encontrado',
          device
        );
      } else {
        return ResponseUtil.error(
          404,
          'Dispositivo no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Dispositivo'
      );
    }
  }

  async update(id, deviceData) {
    try {
      const existingDevice = await this.deviceRepository.findOne({
        where: { id_device: id },
      });

      if (!existingDevice) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      const updatedDevice = await this.deviceRepository.save({
        ...existingDevice,
        ...deviceData,
      });

      return ResponseUtil.success(
        200,
        'Dispositivo actualizado exitosamente',
        updatedDevice
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Dispositivo no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Dispositivo'
      );
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existingDevice = await this.deviceRepository.findOne({
        where: { id_device: id },
      });

      if (!existingDevice) {
        return ResponseUtil.error(404, 'Dispositivo no encontrado');
      }

      existingDevice.estado = 0;
      const updatedDevice = await this.deviceRepository.save(existingDevice);

      if (updatedDevice) {
        return ResponseUtil.success(
          200,
          'Dispositivo eliminado exitosamente',
          updatedDevice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Dispositivo'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Dispositivo'
      );
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  async findByBranchOffice(id_sucursal: number): Promise<any> {
    try {
      const devices = await this.deviceRepository.find({
        where: { id_sucursal: id_sucursal },
      });
  
      const sensors = await Promise.all(devices.map(async (device) => {
        return await this.sensorRepository.find({
          where: { id_device: device.id_device },
        });
      }));
  
      const res_data1 = await Promise.all(devices.map(async (device) => {
        return await this.resDataRepository.find({
          where: { 
            id_device: device.id_device,
            sensor: 'S1'
           },
          order: { fecha: 'DESC' },
          take: 1,
        });
      }));
  
      const res_data2 = await Promise.all(devices.map(async (device) => {
        return await this.resDataRepository.find({
          where: { 
            id_device: device.id_device,
            sensor: 'S2'
           },
          order: { fecha: 'DESC' },
          take: 1,
        });
      }));
  
      if (devices.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Dispositivos'
        );
      }
  
      const consolidatedData = devices.map((device, index) => {
        const deviceSensors = sensors[index];
        const deviceResData1 = res_data1[index][0];
        const deviceResData2 = res_data2[index][0];
  
        const sensorData = deviceSensors.map((sensor) => {
          let sensorResData = null;
          if (sensor.sensor === 'S1') {
            sensorResData = deviceResData1;
          } else if (sensor.sensor === 'S2') {
            sensorResData = deviceResData2;
          }
          return { ...sensor, res_data: sensorResData };
        });
  
        return { ...device, sensors: sensorData };
      });
  
      return ResponseUtil.success(
        200,
        'Dispositivos encontrados',
        consolidatedData
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Dispositivos',
        error.message
      );
    }
  }
}
