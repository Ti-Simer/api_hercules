import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('data')
export class Datum {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    imei: string;

    @Column({ type: 'float' })
    level?: number;

    @Column({ type: 'float' })
    temperature?: number;

    @Column({ type: 'float' })
    pressure?: number;

    @Column({ type: 'float' })
    volume?: number;

    @Column({ type: 'float' })
    mass?: number;

    @Column({ type: 'float' })
    density?: number;

    @Column({ type: 'float' })
    volume_lt?: number;

    @Column({ type: 'float' })
    volume_gl?: number;

    @Column({ type: 'float' })
    percent?: number;

    @Column()
    RCI?: string;

    @Column()
    NVIN?: string;

    @Column()
    NVOUT?: string;

    @CreateDateColumn()
    create: Date;
}
