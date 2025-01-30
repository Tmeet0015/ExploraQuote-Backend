import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Packages } from "./packages";
import { Hotel } from "./hotel";
import { TravelMode } from "./travelMode";
import { DestinationLocation } from "./destinationLocation";

@Entity()
export class Itinerary {
  @PrimaryGeneratedColumn()
  itinerary_id: number;
  
  @ManyToOne(() => Packages, (packages) => packages.itinerary_package, { onDelete: 'CASCADE',nullable: true  })
  @JoinColumn({
      name: 'packages',
      referencedColumnName: 'package_id'
  })
  packages: Packages;

  @Column({nullable: true })
  day_number: number;

  @Column({nullable: true })
  travel_date: Date;

  @Column({ type: "text",nullable: true  })
  activities: string;

  @Column({ type: "text",nullable: true  })
  meal_inclusion: string;

  @Column({ type: "text", nullable: true })
  transportation: string;

  @Column({ type: "text", nullable: true  })
  custom_notes: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  itinerary_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Hotel, (htl) => htl.itinerary, { onDelete: 'CASCADE', nullable: true  })
  @JoinColumn({
      name: 'hotel',
      referencedColumnName: 'hotel_id'
  })
  hotel: Hotel;

  @ManyToOne(() => TravelMode, (travel) => travel.itinerary, { onDelete: 'CASCADE', nullable :true })
  @JoinColumn({
      name: 'travel_mode',
      referencedColumnName: 'travel_mode_id'
  })
  travel_mode: TravelMode;

  @Column({ type: "text", nullable: true  })
  hotel_name: string;

  @Column({ type: "text", nullable: true  })
  room_type: string;

  @Column({nullable: true })
  no_of_room: number;

  @ManyToOne(() => DestinationLocation, (dstloc) => dstloc.itinerary, { onDelete: 'CASCADE' })
  @JoinColumn({
      name: 'destination_location',
      referencedColumnName: 'destinationLocation_id'
  })
  destination_location: DestinationLocation;
  
}
