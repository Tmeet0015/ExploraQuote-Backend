import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

  
  @Entity()
  export class Organization {
    @PrimaryGeneratedColumn()
    brand_id: number;
  
    @Column({nullable : true})
    name: string;
  
    @Column({nullable : true})
    phone: string;
  
    @Column({nullable : true,  unique: true})
    email: string;
  
    @Column({nullable : true})
    address: string;
  
    @Column({nullable : true})
    logo: string;
  
    @Column({nullable : true})
    gst: string;
  
    @Column({nullable : true})
    bank_details: string;
  
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
  }