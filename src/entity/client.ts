import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { Packages } from "./packages";
import { TravelMode } from "./travelMode";
  
  @Entity()
  export class Client {
    @PrimaryGeneratedColumn()
    client_id: number;
  
    @Column({nullable: true })
    client_name: string;
  
    @Column({nullable: true })
    client_contact: string;
  
    @Column({nullable: true })
    email: string;
  
    @Column({nullable: true })
    birth_date: Date;

    @Column({nullable: true })
    aadhar_number: string;

    @Column({nullable: true })
    passport_number: string;

    @Column({nullable: true })
    passport_issue_date: string;

    @Column({nullable: true })
    passport_expire_date: string;
  
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Packages, (packages) => packages.client, { cascade: true })
    client_packages: Packages

    @OneToMany(() => TravelMode, (travelMode) => travelMode.client, { cascade: true, nullable : true})
    travel_mode: TravelMode;
  }
  