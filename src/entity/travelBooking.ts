import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { Itinerary } from "./itineraries";
  import { TravelMode } from "./travelMode";
  
  @Entity()
  export class TravelBooking {
    @PrimaryGeneratedColumn()
    travel_mode_booking_id: number;

    @ManyToOne(() => Itinerary, (itinerary) => itinerary.travel_booking, { onDelete: 'CASCADE', nullable :true })
    @JoinColumn({
        name: 'itinerary',
        referencedColumnName: 'itinerary_id'
    })
    itinerary: Itinerary;

    @ManyToOne(() => TravelMode, (travel) => travel.travel_bookings, { onDelete: 'CASCADE', nullable :true })
    @JoinColumn({
        name: 'travel_mode',
        referencedColumnName: 'travel_mode_id'
    })
    travel_mode: TravelMode;
  
    @Column({ type: "datetime", nullable: false })
    travel_date: Date;
  
    @Column({ type: "text", nullable: true })
    notes: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  