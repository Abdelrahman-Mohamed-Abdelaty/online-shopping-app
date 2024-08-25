import { DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";

class User extends Model{
    declare passwordChangedAt:Date
    declare password: string | undefined;
    declare salt: string | undefined;
    declare id: string | undefined;
    static modelName(){
        return 'users'
    }
}

User.init({
        id:{
            type:DataTypes.BIGINT,
            autoIncrement:true,
            primaryKey:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [5, 30],
            },
            set(value:string){
                this.setDataValue('name',value.toLowerCase())
            }

        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone:{
            type: DataTypes.STRING,
            allowNull:false
        },
        role:{
            type:DataTypes.ENUM,
            defaultValue:"customer",
            values:['customer','vendor','admin','delivery']
        },
        pincode:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
            validate:{
                isEmail:true
            }
        },
        salt:{
            type:DataTypes.STRING,
            unique:true,
            allowNull: false
        },
        password:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        lat:{
            type:DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: -90,
                max: 90,
            },
        },
        lon:{
            type:DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: -180,
                max: 180,
            },
        },
        passwordChangedAt:{
            type:DataTypes.DATE,
            defaultValue: () => {
                const now = new Date();
                now.setMinutes(now.getMinutes() - 2);
                return now;
            },
        },
    },

    {
        sequelize,
        modelName:User.modelName(),
        indexes: [{ unique: true, fields: ['email'] }],
    },
);

export  {User};