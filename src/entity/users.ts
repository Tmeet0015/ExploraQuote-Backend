import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { logs_error } from "./logs_error";
import { Role } from "./role";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    first_name: string

    @Column({ nullable: true })
    last_name: string

    @Column({ nullable: true})
    email: string

    @Column({ default: false })
    is_admin: boolean

    @ManyToOne(() => Role, (role) => role.user, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'role',
        referencedColumnName: 'id'
    })
    role: Role

    @Column({ nullable: true })
    password: string

    @Column({ default: true })
    is_active: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column({ nullable: true })
    deleted_at: Date

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    last_login: Date

    @OneToMany(() => logs_error, (logs_error) => logs_error.user, { cascade: true })
    logs_error: logs_error

}