import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const TableName = 'user';

@Entity(TableName)
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

}