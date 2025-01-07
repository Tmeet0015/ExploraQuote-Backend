import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { Hotel } from "./hotel";
  
  @Entity()
  export class RoomType {
    @PrimaryGeneratedColumn()
    room_type_id: number;
  
    @Column({ nullable: false })
    room_name: string;
  
    @ManyToOne(() => Hotel, (hotel) => hotel.roomTypes, { onDelete: "CASCADE", nullable : true })
    @JoinColumn({ name: "hotel", referencedColumnName: 'hotel_id' })
    hotel: Hotel;
    
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
  