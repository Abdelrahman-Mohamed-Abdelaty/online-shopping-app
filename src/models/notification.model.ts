import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {Product} from "./product.model";
import {User} from "./user.model";


class Notification extends Model{
    static modelName(){
        return 'notifications'
    }
}

Notification.init(
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
        seen:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        to:{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
        from:{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
    },
    {
        sequelize,
        modelName:Notification.modelName(),
        timestamps: true,
    },
);
User.hasMany(Notification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'to'
});
Notification.belongsTo(User,{
    foreignKey:'to'
});

User.hasMany(Notification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'from'
});
Notification.belongsTo(User,{
    foreignKey:'from'
});
export  {Notification};
