import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('res_data')
export class ResDatum {
    @PrimaryGeneratedColumn()
    id_res: number;

    @Column()
    id_device: number;

    @Column()
    senal: string;

    @Column()
    sensor: string;

    @Column()
    nivel: string;

    @Column()
    fecha: Date;
}
