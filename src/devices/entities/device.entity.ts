import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Location } from "src/locations/entities/location.entity";

@Entity('devices')
export class Device {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    imei: string;

    @Column()
    state: number;

    @ManyToOne(() => Location, { cascade: true })
    location: Location;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
