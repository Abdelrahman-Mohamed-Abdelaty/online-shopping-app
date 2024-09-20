import {Request} from "express";

export interface CustomRequest extends Request {
    files: {
        images?:  Express.Multer.File[]
    },
    rowFound:{
        dataValues:{
            images:[string]
        }
    }

}