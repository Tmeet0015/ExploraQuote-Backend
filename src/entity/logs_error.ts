import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm'

import { User } from './users'


@Entity()
export class logs_error {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    created_at: Date

    @Column({ nullable: true, type: 'text' })
    cameFrom: string

    @Column({ nullable: true, type: 'text' })
    message: string

    @ManyToOne(() => User, (user) => user.logs_error, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'user',
        referencedColumnName: 'id'
    })
    user: User;

    @Column({ nullable: true, type: 'text' })
    body: string
    
}