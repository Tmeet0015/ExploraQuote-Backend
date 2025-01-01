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
  export class FlightDetails {
    @PrimaryGeneratedColumn()
    flight_id: number;
  
    @ManyToOne(() => TravelMode, (travel) => travel.flight_details, { onDelete: 'CASCADE', nullable :true })
    @JoinColumn({
        name: 'travel_mode',
        referencedColumnName: 'travel_mode_id'
    })
    travel_mode: TravelMode;        
  
    @Column({ nullable: true })
    flight_no: string;
  
    @Column({ type: "int", nullable: true })
    flight_duration: number;
  
    @Column({ type: "datetime", nullable: true })
    flight_departure: Date;
  
    @Column({ type: "datetime", nullable: true })
    flight_arrival: Date;
  
    @Column({ nullable: true })
    arrival_location: string;
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    flight_fare: number;
  
    @Column({ type: "text", nullable: true })
    notes: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  