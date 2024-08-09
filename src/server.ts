import express from "express";
import App from "./services/app"
import {connectToDatabase} from "./services/dbConnect";

import dotenv from 'dotenv';
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT=3001;
const startServer=async ()=>{
    const app= express();
    await App(app);
    await connectToDatabase();
    return app.listen(PORT, () => {
        console.log(`server run on port ${PORT}`)
    });
}

const server = startServer();
export default server;
