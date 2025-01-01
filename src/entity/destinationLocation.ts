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
  import { Destination } from "./destination";
  import { Location } from "./location";
import { Packages } from "./packages";
import { Hotel } from "./hotel";
  
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

    @ManyToOne(() => Location, (loc) => loc.location_id, { onDelete: 'CASCADE' })
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

    @OneToMany(() => Packages, (pkg) => pkg.destination_location, { cascade: true })
    packages: Packages

    @OneToMany(() => Hotel, (htl) => htl.destination_location, { cascade: true })
    hotel: Hotel
  }
  