import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class CronLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true })
  updated_package_ids: string;

  @CreateDateColumn()
  executed_at: Date;
}
