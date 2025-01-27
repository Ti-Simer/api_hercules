import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn()
    id_device: number;

    @Column()
    imei: string;

    @Column()
    id_zona: number;

    @Column()
    id_sucursal: number;

    @Column()
    password: string;

    @Column()
    observacion: string;

    @Column()
    estado: number;

    @Column()
    conexion: string;

    @Column({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'timestamp' })
    updated: Date;
}
