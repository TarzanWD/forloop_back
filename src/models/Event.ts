import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity} from 'typeorm'
import {Room} from './Room'

@Entity()
export class Event extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(type => Room, room => room.id)
    room: Room;

    @Column()
    eventName: string;

    @Column()
    peopleMails: string;

    @Column()
    date_from: string;

    @Column()
    date_till: string;
}