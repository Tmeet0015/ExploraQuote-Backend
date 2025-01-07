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
  export class CarDetails {
    @PrimaryGeneratedColumn()
    car_id: number;
  
    @ManyToOne(() => TravelMode, (travelMode) => travelMode.car_details, { onDelete: "CASCADE", nullable : true })
    @JoinColumn({ name: "travel_mode", referencedColumnName : 'travel_mode_id' })
    travel_mode: TravelMode;
  
    @Column({ nullable: true })
    car_type: string;
  
    @Column({ type: "datetime", nullable: true })
    pickup_date: Date;
  
    @Column({ nullable: true })
    pickup_address: string;
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    car_fare: number;
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    discount: number;
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    total_fare: number;
  
    @Column({ type: "text", nullable: true })
    notes: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  