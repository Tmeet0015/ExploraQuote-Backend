import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export class TravelMode {
    @PrimaryGeneratedColumn()
    travel_mode_id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'datetime' })
    travel_date: Date;
  
    @Column({ nullable: true })
    flight_no: string | null;
  
    @Column({ nullable: true })
    train_no: number | null;
  
    @Column({ type: 'datetime', nullable: true })
    pickup_date: Date | null;
  
    @Column({ nullable: true })
    pickup_address: string | null;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  