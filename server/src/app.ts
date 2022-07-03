import express, { Request, Response, NextFunction } from 'express';
import { Todo } from './models/Todo'
import { createConnection } from 'typeorm';
import todoRouter from './routes/todo';
import { addTodo} from './controller/todoController'
const router = express.Router()

//config()
const app = express();
const io = require("socket.io");


app.use(express.json());

app.get('/', (_, res) => {
  res.send('hello');
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, X-Real-Ip, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

let _socketServer:any

(async () => {
   try {
    await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'yahsuanlin',
    database: 'todotype',
    password: undefined,
    entities: [
       Todo
    ],
    synchronize: true,
    logging: false,
    });
    console.log('connected db')
   } catch (error) {
       console.log(error, 'not connected db')
   }
   
    
    /* 
        routes
    */
    app.use('/todo', todoRouter)

    // todo
    await addTodo({id: '1', name: 'wash', isDone: false })
    await addTodo({id: '2', name: 'grocery', isDone: true})

    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

    _socketServer = new io.Server(server, {cookie: false});

     _socketServer.on('connection', (socket: any) => {
        console.log(`socket connected ${socket.id}`)

        socket.conn.on("upgrade", () => {
            const upgradedTransport = socket.conn.transport.name; 
        });
    })

})();



const socketServer = () => _socketServer

export { app, socketServer };
