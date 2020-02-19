import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import db from './utils/database';
import userRouter from './api/routes/userRouter';

//Path to read .env at root of project
dotenv.config({path: "../.env"});

//Constants
const { PORT } = process.env;
const VERSION  = "/api/v1/";
const API = express();

//Middleware
API.use((req, __, next) => { req.db = db; next()});
API.use(express.urlencoded({extended: false}));
API.use(express.json());
API.use(cors({origin: "http://localhost:3000", credentials: true}));
API.use(cookieParser());

//Routes
API.use(`${VERSION}`, userRouter);

API.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

export default API;