import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {User} from "./user.model";


class Vendor extends Model{
    static User: BelongsTo<Vendor, User>;
    user: any;
    static modelName(){
        return 'vendors'
    }
}

Vendor.init(
    {
        userId:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
    },
    {
        sequelize,
        modelName:Vendor.modelName(),
        timestamps: false,
    },
);
User.hasOne(Vendor, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Vendor.User = Vendor.belongsTo(User,{as:'user'});
export  {Vendor};