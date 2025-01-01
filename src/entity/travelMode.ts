  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  import { TravelBooking } from "./travelBooking";
import { FlightDetails } from "./flightDetails";
  
  @Entity()
  export class TravelMode {
    @PrimaryGeneratedColumn()
    travel_mode_id: number;
  
    @Column({ nullable: false })
    name: string;
  
    @Column({ type: "datetime", nullable: true })
    travel_start_date: Date;
  
    @Column({ type: "datetime", nullable: true })
    travel_end_date: Date;
  
    @Column({ nullable: true })
    booking_method: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
    
    @OneToMany(() => TravelBooking, (travelBooking) => travelBooking.travel_mode, { cascade: true })
    travel_bookings: TravelBooking;

    @OneToMany(() => FlightDetails, (flght) => flght.travel_mode, { cascade: true })
    flight_details: FlightDetails;
  }
  
  