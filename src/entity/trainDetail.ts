import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { TravelMode } from "./travelMode";
  
  @Entity()
  export class TrainDetails {
    @PrimaryGeneratedColumn()
    train_id: number;
  
    @ManyToOne(() => TravelMode, (travelMode) => travelMode.train_details, { onDelete: "CASCADE", nullable : true })
    @JoinColumn({ name: "travel_mode", referencedColumnName  :'travel_mode_id' })
    travel_mode: TravelMode;
  
    @Column({ nullable: true })
    train_no: string;
  
    @Column({ type: "int", nullable: true })
    train_duration: number;
  
    @Column({ type: "datetime", nullable: true })
    train_departure: Date;
  
    @Column({ type: "datetime", nullable: true })
    train_arrival: Date;
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    train_fare: number;
  
    @Column({ type: "text", nullable: true })
    notes: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  