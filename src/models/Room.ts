import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    sensorId: string;

    @Column()
    max_people: number;

    @Column()
    location: string;

    @Column()
    is_full: boolean;

    @Column()
    last_battery_percentage: number;
}