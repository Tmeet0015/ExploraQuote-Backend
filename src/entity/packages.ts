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
  import { Location } from "./location";
  import { Client } from "./client";
import { Itinerary } from "./itineraries";
  
  @Entity()
  export class Packages {
    @PrimaryGeneratedColumn()
    package_id: number;
  
    @ManyToOne(() => Location, (location) => location.location_packages, { onDelete: 'CASCADE', nullable: true  })
    @JoinColumn({
        name: 'location',
        referencedColumnName: 'location_id'
    })
    location: Location;

    @ManyToOne(() => Client, (client) => client.client_packages, { onDelete: 'CASCADE', nullable: true  })
    @JoinColumn({
        name: 'client',
        referencedColumnName: 'client_id'
    })
    client: Client;
  
    @Column({nullable: true })
    package_name: string;
  
    @Column({nullable: true })
    package_start_date: Date;
  
    @Column({nullable: true })
    package_end_date: Date;
  
    @Column({nullable: true })
    no_days: number;
  
    @Column({nullable: true })
    no_pax: number;
  
    @Column({ type: "text",nullable: true  })
    description: string;
  
    @Column({ type: "decimal", precision: 10, scale: 2,nullable: true  })
    price: number;
  
    @Column({nullable: true })
    image_url: string;
  
    @Column({
      type: "enum",
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    })
    status: "pending" | "accepted" | "rejected" | "expired";
  
    @Column({nullable: true })
    quote_validity: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Itinerary, (itinerary) => itinerary.packages, { cascade: true })
    itinerary_package: Itinerary
    
  }
  