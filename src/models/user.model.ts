import { DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";

class User extends Model{
    declare passwordChangedAt:Date
    declare password: string | undefined;
    declare salt: string | undefined;
    declare id: number;
    declare refreshToken: string | undefined;
    declare isAvailable:boolean;
    static modelName(){
        return 'users'
    }
    isPasswordChangedRecent(jwtIssuedAtDate:number){
        return this.dataValues.passwordChangedAt&&
            (this.dataValues.passwordChangedAt>new Date(jwtIssuedAtDate*1000))
    }
    static async findByPk(pk: number, options?: any): Promise<User | null> {
        const result = await super.findByPk(pk, options) as User;
        result.password = undefined;
        result.salt = undefined;
        return result;
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
        email:{
            type:DataTypes.STRING,
            unique:'email',
            allowNull:false,
            validate:{
                isEmail:true
            }
        },
        salt:{
            type:DataTypes.STRING,
            unique:'salt',
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
        isAvailable:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
        lastDelivery:{
          type:DataTypes.DATE,
          defaultValue:'2024-01-01'
        },
        photo:{
            type:DataTypes.STRING
        },
    },

    {
        sequelize,
        modelName:User.modelName(),
    },
);

export  {User};