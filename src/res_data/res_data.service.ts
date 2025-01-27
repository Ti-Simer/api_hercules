import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { format, differenceInDays } from 'date-fns';
import { ResponseUtil } from 'src/utils/response.util';
import { ResDatum } from './entities/res_datum.entity';

@Injectable()
export class ResDataService {
  constructor(
    @InjectRepository(ResDatum) private resDataRepository: Repository<ResDatum>,
  ) { }

  async create(resData: ResDatum): Promise<any> {
    try {
      if (resData) {
        const newResData = this.resDataRepository.create({
          ...resData,
        });

        const createdResData = await this.resDataRepository.save(newResData);

        if (createdResData) {
          return ResponseUtil.success(
            200,
            'ResData creado exitosamente',
            createdResData
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el ResData'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el ResData'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const resData = await this.resDataRepository.find();

      if (resData.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado ResData'
        );
      }

      return ResponseUtil.success(
        200,
        'ResData encontrados',
        resData
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los ResData',
        error.message
      );
    }
  }

  async findOne(id: number) {
    try {
      const resData = await this.resDataRepository.findOne({
        where: { id_res: id },
      });

      if (resData) {
        return ResponseUtil.success(
          200,
          'ResData encontrado',
          resData
        );
      } else {
        return ResponseUtil.error(
          404,
          'ResData no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el ResData'
      );
    }
  }

  async update(id, resData) {
    try {
      const existingResData = await this.resDataRepository.findOne({
        where: { id_res: id },
      });

      if (!existingResData) {
        throw new NotFoundException('ResData no encontrado');
      }

      const updatedResData = await this.resDataRepository.save({
        ...existingResData,
        ...resData,
      });

      return ResponseUtil.success(
        200,
        'ResData actualizado exitosamente',
        updatedResData
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'ResData no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el ResData'
      );
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  async findByDevice(id_device: number): Promise<any> {
    try {
      const devices = await this.resDataRepository.find({
        where: { id_device: id_device },
        order: { fecha: 'DESC' },
        take: 1,
      });

      if (devices.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado ResData'
        );
      }

      return ResponseUtil.success(
        200,
        'ResData encontrado',
        devices[0]
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los ResData',
        error.message
      );
    }
  }

  async findBySensor(sensor_data: any): Promise<any> {
    try {
      const res_data = await this.resDataRepository.find({
        where: {
          id_device: sensor_data.id_device,
          sensor: sensor_data.sensor
        },
        order: { fecha: 'DESC' },
        take: 2500,
      });

      if (res_data.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado ResData'
        );
      }

      let sortedResData = res_data.sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

      // Filtrar los datos que tienen nivel válido
      sortedResData = sortedResData.filter(data => !isNaN(parseFloat(data.nivel)));

      const filteredResData = res_data.filter((data, index, array) => {
        if (index === 0) return false;
        const previousData = array[index - 1];
        const currentNivel = parseInt(data.nivel);
        const previousNivel = parseInt(previousData.nivel);

        // Nivel actual debe ser estrictamente mayor que el anterior
        const isNivelGrowing = currentNivel > previousNivel;
        return isNivelGrowing;
      });

      const formattedResData = sortedResData.map(data => ({
        ...data,
        fecha: format(new Date(data.fecha), 'yy-MM-dd HH:mm:ss')
      }));

      const totalDays = filteredResData.reduce((acc, data, index, array) => {
        if (index === 0) return acc;
        const previousDate = new Date(array[index - 1].fecha);
        const currentDate = new Date(data.fecha);
        return acc + differenceInDays(currentDate, previousDate);
      }, 0);

      const averageDaysDecimal = totalDays / (filteredResData.length - 1);
      const averageDays = Math.floor(averageDaysDecimal);
      const averageHours = Math.round((averageDaysDecimal - averageDays) * 24);
      const averageDaysFormatted = `${String(averageDays).padStart(2, '0')}:${String(averageHours).padStart(2, '0')}`;

      // Filtrar los datos por niveles por debajo de 50 y por encima de 50
      const levelsBelow50 = sortedResData.filter(data => parseFloat(data.nivel) < 50);
      const levelsAbove50 = sortedResData.filter(data => parseFloat(data.nivel) >= 50);

      // Calcular el promedio de los niveles por debajo de 50
      const totalBelow50 = levelsBelow50.reduce((acc, data) => acc + parseFloat(data.nivel), 0);
      const averageBelow50 = levelsBelow50.length > 0 ? (totalBelow50 / levelsBelow50.length).toFixed(2) : 'N/A';

      // Calcular el promedio de los niveles por encima de 50
      const totalAbove50 = levelsAbove50.reduce((acc, data) => acc + parseFloat(data.nivel), 0);
      const averageAbove50 = levelsAbove50.length > 0 ? (totalAbove50 / levelsAbove50.length).toFixed(2) : 'N/A';

      // Calcular el promedio de todos los niveles en sortedResData
      const totalNivel = sortedResData.reduce((acc, data) => acc + parseFloat(data.nivel), 0);
      const averageNivel = sortedResData.length > 0 ? (totalNivel / sortedResData.length).toFixed(2) : 'N/A';

      return ResponseUtil.success(
        200,
        'ResData encontrado',
        {
          res_data: formattedResData,
          resume_info: {
            average_days_between_recharges: averageDaysFormatted,
            average_below_50: averageBelow50,
            average_above_50: averageAbove50,
            average_nivel: averageNivel
          }
        }
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los ResData',
        error.message
      );
    }
  }

}
