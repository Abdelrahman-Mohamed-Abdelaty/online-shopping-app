import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URI as string,{
    define:{
        freezeTableName:true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging:false,
});
export {sequelize}
