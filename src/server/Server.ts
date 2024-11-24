import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { router } from './routes';

const corsConfig = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}

const server = express();

server.use(cors(corsConfig));
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));
server.use(router);


export { server };
