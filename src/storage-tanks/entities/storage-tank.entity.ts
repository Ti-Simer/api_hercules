import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Device } from "src/devices/entities/device.entity";

@Entity('storage_tanks')
export class StorageTank {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    serial: string;

    @Column()
    state: number;

    @Column('json')
    aforo?: any;

    @ManyToOne(() => Device, { cascade: true })
    device: Device;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
