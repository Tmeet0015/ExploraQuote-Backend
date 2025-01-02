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
import { Hotel } from "./hotel";
import { PackageDestLocation } from "./packageDestLocation";
  
  @Entity()
  export class DestinationLocation {
    @PrimaryGeneratedColumn()
    destinationLocation_id: number;

    @ManyToOne(() => Destination, (destination) => destination.destination_id, { onDelete: 'CASCADE', nullable : true})
    @JoinColumn({
        name: 'destination',
        referencedColumnName: 'destination_id'
    })
    destination: Destination;

    @ManyToOne(() => Location, (loc) => loc.location_id, { onDelete: 'CASCADE', nullable : true})
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

    @OneToMany(() => Hotel, (htl) => htl.destination_location, { cascade: true, nullable : true })
    hotel: Hotel
    
    @OneToMany(() => PackageDestLocation, (pkg) => pkg.destination_location, { cascade: true, nullable : true})
    package_dest_location: PackageDestLocation
  }
  