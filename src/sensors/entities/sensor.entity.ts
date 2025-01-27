import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sensores')
export class Sensor {
    @PrimaryGeneratedColumn()
    id_sensor: number;

    @Column()
    sensor: string;

    @Column()
    id_device: number;

    @Column()
    cap_tanque: number;

    @Column()
    estado: number;

    @Column()
    observacion: string;

    @Column({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'timestamp' })
    updated: Date;
}
