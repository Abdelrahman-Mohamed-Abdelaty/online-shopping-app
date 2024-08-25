import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {User} from "./user.model";

class Delivery extends Model{
    static User: BelongsTo<Delivery, User>;
    user: any;
    static modelName(){
        return 'deliveries'
    }
}

Delivery.init(
    {
        userId:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
    },
    {
        sequelize,
        modelName:Delivery.modelName(),
        timestamps: false,
    },
);
User.hasOne(Delivery, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Delivery.User = Delivery.belongsTo(User,{as:'user'});
export  {Delivery};