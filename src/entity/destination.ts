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
  export class Destination {
    @PrimaryGeneratedColumn()
    destination_id: number;
  
    @Column({unique:true})
    destination_name: string;
  
    @Column({
      type: "enum",
      enum: ["domestic", "international"],
      default: "domestic",
    })
    type: "domestic" | "international";
  
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

    @OneToMany(() => DestinationLocation, (destination_location) => destination_location.destination, { cascade: true })
    destination_location: DestinationLocation
  }
  