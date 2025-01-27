import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column()
    usuario: string;

    @Column()
    password: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    identificacion: string;

    @Column()
    correo: string;

    @Column()
    correo2: string;

    @Column()
    correo3: string;

    @Column()
    telefono: string;

    @Column({ type: 'timestamp' })
    last_session: Date;
    
    @Column()
    activacion: number;

    @Column()
    token: string;

    @Column()
    token_app: string;

    @Column()
    token_password: string;

    @Column()
    password_request: number;

    @Column()
    id_tipo: number;

    @Column()
    id_ciudad: number;

    @Column()
    id_zona: number;

    @Column()
    estado: number;

    @Column({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'timestamp' })
    updated: Date;
}
