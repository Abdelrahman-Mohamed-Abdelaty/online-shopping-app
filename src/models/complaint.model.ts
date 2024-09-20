import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {Product} from "./product.model";
import {User} from "./user.model";


class Complaint extends Model{
    static modelName(){
        return 'complaints'
    }
}

Complaint.init(
    {
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true,
        },
        message:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        topic:{
            type:DataTypes.ENUM,
            values:['order','delivery','other'],
            allowNull:false
        },
        status:{
            type:DataTypes.ENUM,
            values:['under-review','reviewed','solved'],
            allowNull:false,
            defaultValue:'under-review'
        },
        customerId:{
            type:DataTypes.BIGINT,
            allowNull:false,
        }
    },
    {
        sequelize,
        modelName:Complaint.modelName(),
        timestamps: true,
    },
);
User.hasMany(Complaint, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'customerId'
});
Complaint.belongsTo(User,{
    foreignKey:'customerId'
});
export  {Complaint};
