import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
  } from "typeorm";
  import { DestinationLocation } from "./destinationLocation";
import { Itinerary } from "./itineraries";
  
  @Entity()
  export class Hotel {
    @PrimaryGeneratedColumn()
    hotel_id: number;

    @Column({ nullable: true })
    hotel_name: string;
  
    @Column({nullable: true })
    hotel_description: string;
  
    @Column({ type: "datetime", nullable: true })
    check_in_time: Date;
  
    @Column({ type: "datetime", nullable: true })
    check_out_time: Date;
  
    @Column({ type: "decimal", precision: 3, scale: 2, nullable: true })
    rating: number;
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    price_per_night: number;
  
    @Column({nullable: true })
    room_types: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => DestinationLocation, (destloc) => destloc.hotel, { onDelete: 'CASCADE', nullable:true })
    @JoinColumn({
        name: 'destination_location',
        referencedColumnName: 'destinationLocation_id'
    })
    destination_location: DestinationLocation;

    @OneToMany(() => Itinerary, (itr) => itr.hotel, { cascade: true })
    itinerary: Itinerary
  
  }
  