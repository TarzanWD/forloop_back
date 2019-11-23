import { Room } from "../models/Room"
import { Request, Response } from 'express'
import { google } from 'googleapis'
import { getConnection } from 'typeorm'
import * as moment from 'moment'
import { authorize } from '../utils/google' 

export const createEvent = async (req: Request, res: Response) => {
    const { eventName, peopleMails, room_id, date_from, date_till } = req.body
    const repo = getConnection().getRepository(Room)
    const room = await repo.findOne({ id: room_id })


    const event = assembleNewEvent({ eventName, room: { location: room.location }, date: { from: date_from, till: date_till }, attendees: peopleMails})
    const sendAnswer = (answer) => {
        res.json(answer)
    }
    try {
        authorize(insertEventToCalendar(event, 'marecek@marekhradil.net', sendAnswer))
    } catch (e) {
        console.error(e)
        res.json({})
    }
}

export const listEvents = async(req: Request, res: Response) => {
    const { from, till } = req.body

    try {
        authorize(listEventsFromCalendar('marecek@marekhradil.net', { from, till }, (answer) => res.json(answer)))
    } catch (e) {
        console.error(e)
        res.json([])
    }
}

export const timeline = async(req: Request, res: Response) => {
    try {
        const from = new Date()
        const till = moment(from.toISOString()).add('1', 'month').toISOString()
        authorize(listEventsFromCalendar('marecek@marekhradil.net', { from, till }, (answer) => res.json(answer.map(({ start: { dateTime: startDateTime }, end: { dateTime: endDateTime }, status, summary}) => (
            {
                startDateTime,
                endDateTime,
                status,
                summary
            }
        )))))
    } catch (e) {
        console.error(e)
        res.json([])
    }
}

export const listTimes = async(req: Request, res: Response) => {
    const { from, till } = req.body
    try {
        authorize(listEventsFromCalendar('marecek@marekhradil.net', { from, till }, (answer) => {
            res.json(answer.map(({ start, end }) => [start, end]))
        }))
    } catch (e) {
        console.error(e)
        res.json([])
    }
}

const listEventsFromCalendar = (calendarId , { from, till }, cb) => auth => {
    const calendar = google.calendar({ version: 'v3', auth })
        calendar.events.list(
          {
            calendarId,
            timeMin: from,
            timeMax: till,
            singleEvents: true,
            orderBy: 'startTime',
          },
          (err, res) => {
            if (err)  {
                console.error(err)
                cb([])
            }

            const events = res.data.items
            if (events.length) {
              cb(events)
            } else {
              cb([])
            }
          }
        )
}

const assembleNewEvent = ({ eventName, room: { location }, date: { from, till }, attendees}) => ({
    summary: eventName,
    location,
    description: 'Automatticaly created event by Busyroom',
    start: {
        timeZone: 'Europe/Prague',
        dateTime: from,
    },
    end: {
        timeZone: 'Europe/Prague',
        dateTime: till
    },
    attendees: attendees.map((email) => ({ email })),
    reminders: {
        useDefault: false,
        overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
        ]
    }
})

const insertEventToCalendar = (event, calendarId, cb) => auth => {
    const calendar = google.calendar({ version: 'v3', auth })
  
    calendar.events.insert(
      {
        auth,
        calendarId,
        // @ts-ignore
        resource: event as any
      },
      (err, event) => {
        if (err) {
          cb({})
        }
        cb(event)
      }
    )
}