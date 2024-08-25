import express from "express";
import {config} from 'dotenv'
config();

import {dbStart} from "./services/dbConnect";
import App from "./services/app"

const PORT=3001;

const startServer=async ()=>{
    const app= express();
    await dbStart();
    await App(app);
    return app.listen(PORT, () => {
        console.log(`server run on port ${PORT}`)
    });

}

const server = startServer();
export default server;
