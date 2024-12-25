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
import { Client } from "./client";

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

  @ManyToOne(() => Client, (client) => client.client_itinerary, { onDelete: 'CASCADE', nullable: true  })
  @JoinColumn({
      name: 'client',
      referencedColumnName: 'client_id'
  })
  client: Client;

  @Column({nullable: true })
  day_number: number;

  @Column({nullable: true })
  travel_date: Date;

  @Column({ type: "text",nullable: true  })
  accommodation: string;

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
}
