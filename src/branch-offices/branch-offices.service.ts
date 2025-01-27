import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { BranchOffice } from './entities/branch-office.entity';

@Injectable()
export class BranchOfficesService {
  constructor(
    @InjectRepository(BranchOffice) private branchOfficeRepository: Repository<BranchOffice>,
  ) { }

  async create(BranchOfficeData: BranchOffice): Promise<any> {
    try {
      if (BranchOfficeData) {
        const newBranchOffice = this.branchOfficeRepository.create({
          ...BranchOfficeData,
        });

        const createdBranchOffice = await this.branchOfficeRepository.save(newBranchOffice);

        if (createdBranchOffice) {
          return ResponseUtil.success(
            200,
            'Sucursal creada exitosamente',
            createdBranchOffice
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Sucursal'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Sucursal'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const branchOffices = await this.branchOfficeRepository.find({
        where: { estado: 1 },
      });

      if (branchOffices.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrada Sucursales'
        );
      }

      return ResponseUtil.success(
        200,
        'Sucursales encontradas',
        branchOffices
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Sucursales',
        error.message
      );
    }
  }

  async findOne(id: number) {
    try {
      const branchOffice = await this.branchOfficeRepository.findOne({
        where: { id_sucursal: id },
      });

      if (branchOffice) {
        return ResponseUtil.success(
          200,
          'Sucursal encontrada',
          branchOffice
        );
      } else {
        return ResponseUtil.error(
          404,
          'Sucursal no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Sucursal'
      );
    }
  }

  async update(id, BranchOfficeData) {
    try {
      const existingbranchOffice = await this.branchOfficeRepository.findOne({
        where: { id_sucursal: id },
      });

      if (!existingbranchOffice) {
        throw new NotFoundException('Sucursal no encontrada');
      }

      const updatedbranchOffice = await this.branchOfficeRepository.save({
        ...existingbranchOffice,
        ...BranchOfficeData,
      });

      return ResponseUtil.success(
        200,
        'Sucursal actualizada exitosamente',
        updatedbranchOffice
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Sucursal no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Sucursal'
      );
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existingbranchOffice = await this.branchOfficeRepository.findOne({
        where: { id_sucursal: id },
      });

      if (!existingbranchOffice) {
        return ResponseUtil.error(404, 'Sucursal no encontrada');
      }

      existingbranchOffice.estado = 0;
      const updatedbranchOffice = await this.branchOfficeRepository.save(existingbranchOffice);

      if (updatedbranchOffice) {
        return ResponseUtil.success(
          200,
          'Sucursal eliminado exitosamente',
          updatedbranchOffice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Sucursal'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Sucursal'
      );
    }
  }
}
