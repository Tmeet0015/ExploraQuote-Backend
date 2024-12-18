import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { Destination } from "./destination";
  import { Location } from "./location";
  
  @Entity()
  export class DestinationLocation {
    @PrimaryGeneratedColumn()
    destinationLocation_id: number;

    @ManyToOne(() => Destination, (destination) => destination.destination_id, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'destination',
        referencedColumnName: 'destination_id'
    })
    destination: Destination;

    @ManyToOne(() => Location, (destination) => destination.location_id, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'location',
        referencedColumnName: 'location_id'
    })
    location: Location;
  
    @Column({
      type: "enum",
      enum: ["active", "inactive"],
      default: "active",
    })
    status: "active" | "inactive";
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  