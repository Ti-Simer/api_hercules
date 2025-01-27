import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ciudades')
export class City {
    @PrimaryGeneratedColumn()
    id_ciudad: number;

    @Column()
    ciudad: string;

    @Column()
    estado: number;

    @Column()
    observacion: string;

    @Column({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'timestamp' })
    updated: Date;
}
