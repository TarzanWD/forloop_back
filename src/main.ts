import * as express from 'express'
import { getConnectionManager } from 'typeorm'
import { createEvent, listEvents, listTimes, timeline } from './controllers/event'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { createRoom, listRooms, motionRoom, getRoom } from './controllers/room'

const startServer = async () => {
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())

    const connectionManager = getConnectionManager();
    const connection = await connectionManager.create({
        type: "postgres",
        host: "localhost",
        port: 5434,
        username: "root",
        password: "root",
        database: "busyroom",
        entities: [__dirname + '/models/*'],
        synchronize: true
    })

    await connection.connect()

    app.post('/event/create', createEvent)
    app.post('/event/list', listEvents)
    app.post('/event/list-times', listTimes)
    app.get('/room/list', listRooms)
    app.post('/room/create', createRoom)
    app.get('/timeline', timeline)
    app.get('/room/:id', getRoom)
    app.post('/', motionRoom)

    app.listen(3000, () => {
        console.log('Listening')
    })
}

startServer()