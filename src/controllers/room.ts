import { Room } from "../models/Room"
import { Request, Response } from 'express'
import { getConnection, Repository } from "typeorm"

export const createRoom = async (req: Request, res: Response) => {
    const { location, max_people, name, sensor_id } = req.body
    const room = new Room()
    
    room.location = location
    room.max_people = Number(max_people)
    room.name = String(name)
    room.sensorId = String(sensor_id)
    room.is_full = false
    room.last_battery_percentage = 100


    const repo = getConnection().getRepository(Room)

    try {
        await repo.save(room)
        res.json({
            saved: true
        })
    } catch (e) {
        console.error(e)
        res.json({
            saved: false
        })
    }
}

export const listRooms = async (req: Request, res: Response) => {
    const repo = getConnection().getRepository(Room)

    try {
        const allRooms = await repo.find()
        res.json({
            rooms: allRooms
        })
    } catch (e) {
        console.error(e)
        res.json({
            rooms: []
        })
    }
}


export const motionRoom = async (req: Request, res: Response) => {
    const { battery_percentage, motion_count } = req.body.payload_fields
    const { hardware_serial } = req.body
    const repo = getConnection().getRepository(Room)

    try {
        const rightRoom = await repo.findOne({ sensorId: hardware_serial })
        if (!rightRoom) {
            res.end()
        }
        
        rightRoom.last_battery_percentage = battery_percentage || 0
        rightRoom.is_full = Number(motion_count) > 2

        await rightRoom.save()
        res.end()
    } catch (e) {
        console.error(e)
        res.end()
    }
}

export const getRoom = async (req: Request, res: Response) => {
    const { id } = req.params
    const repo = getConnection().getRepository(Room)

    try {
        const room = await repo.findOne({ id })
        res.json({
            room
        })
    } catch (e) {
        console.error(e)
        res.json({
            room: {}
        })
    }
}