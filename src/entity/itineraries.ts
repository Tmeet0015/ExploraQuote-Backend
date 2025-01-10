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
import { Packages } from "./packages";
import { TravelBooking } from "./travelBooking";
import { Hotel } from "./hotel";
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


  @OneToMany(() => TravelBooking, (travelBooking) => travelBooking.itinerary, { cascade: true })
  travel_booking: TravelBooking
  
}
