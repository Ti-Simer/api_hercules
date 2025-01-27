import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sucursales')
export class BranchOffice {
    @PrimaryGeneratedColumn()
    id_sucursal: number;

    @Column()
    sucursal: string;

    @Column()
    direccion: string;

    @Column()
    telefono: string;

    @Column()
    id_zona: number;

    @Column()
    estado: number;

    @Column()
    observacion: string;

    @Column({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'timestamp' })
    updated: Date;
}
