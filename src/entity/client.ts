import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { Packages } from "./packages";
import { Itinerary } from "./itineraries";
  
  @Entity()
  export class Client {
    @PrimaryGeneratedColumn()
    client_id: number;
  
    @Column({nullable: true })
    client_name: string;
  
    @Column({nullable: true })
    client_contact: string;
  
    @Column({nullable: true })
    adult_no: number;
  
    @Column({nullable: true })
    passport_details: string;
  
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Packages, (packages) => packages.client, { cascade: true })
    client_packages: Packages
    
    @OneToMany(() => Itinerary, (itinerary) => itinerary.client, { cascade: true })
    client_itinerary: Itinerary
  }
  