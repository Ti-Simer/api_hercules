import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('zonas')
export class Zone {
    @PrimaryGeneratedColumn()
    id_zona: number;

    @Column()
    zona: string;

    @Column()
    id_ciudad: number;

    @Column()
    estado: number;

    @Column()
    observacion: string;

    @Column({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'timestamp' })
    updated: Date;
}
