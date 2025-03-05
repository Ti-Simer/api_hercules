import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, } from 'typeorm';

@Entity('locations')
export class Location {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    state: number;

    @ManyToOne(() => Location, (location) => location.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent_id?: Location;

    @OneToMany(() => Location, (location) => location.parent_id)
    children?: Location[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
