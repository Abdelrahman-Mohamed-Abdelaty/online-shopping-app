import {sequelize} from "../utility/sequelize";
import * as models from '../models'

const dbStart = async ()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync({alter:true});
        console.log('Connection has been established successfully.');
    }catch (error){
        console.error('Unable to connect to the database:', error);
    }
}
export {dbStart}