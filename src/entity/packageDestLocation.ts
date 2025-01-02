import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { Packages } from "./packages";
import { DestinationLocation } from "./destinationLocation";
  
  @Entity()
  export class PackageDestLocation {
    @PrimaryGeneratedColumn()
    package_dest_loc_id: number;
  
    @ManyToOne(() => Packages, (pkg) => pkg.package_dest_location, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'package',
        referencedColumnName: 'package_id'
    })
    package: Packages;

    @ManyToOne(() => DestinationLocation, (dstloc) => dstloc.package_dest_location, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'destination_location',
        referencedColumnName: 'destinationLocation_id'
    })
    destination_location: DestinationLocation;

    @Column({ default: true })
    is_active: boolean


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

  }
  