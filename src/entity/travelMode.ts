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
import { TrainDetails } from "./trainDetail";
import { CarDetails } from "./cardDetail";
  
  @Entity()
  export class TravelMode {
    @PrimaryGeneratedColumn()
    travel_mode_id: number;
  
    @Column({ nullable: true })
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
    
    @OneToMany(() => TravelBooking, (travelBooking) => travelBooking.travel_mode, { cascade: true, nullable : true })
    travel_bookings: TravelBooking;

    @OneToMany(() => FlightDetails, (flght) => flght.travel_mode, { cascade: true, nullable : true })
    flight_details: FlightDetails;

    @OneToMany(() => TrainDetails, (trainDetail) => trainDetail.travel_mode, { cascade: true, nullable : true})
    train_details: TrainDetails;

    @OneToMany(() => CarDetails, (carDetails) => carDetails.travel_mode, { cascade: true, nullable : true})
    car_details: CarDetails;
  }
  
  