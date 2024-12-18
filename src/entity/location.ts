import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { DestinationLocation } from "./destinationLocation";
  
  @Entity()
  export class Location {
    @PrimaryGeneratedColumn()
    location_id: number;
  
    @Column()
    location_name: string;
  
    @Column({ nullable :true })
    country: string;
  
    @Column({ nullable :true })
    city: string;
  
    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true })
    latitude: number;
  
    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true })
    longitude: number;
  
    @Column({
      type: "enum",
      enum: ["active", "inactive", "archived"],
      default: "active",
    })
    status: "active" | "inactive" | "archived";
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => DestinationLocation, (destination_location) => destination_location.location, { cascade: true })
    destination_location: DestinationLocation
  }
  