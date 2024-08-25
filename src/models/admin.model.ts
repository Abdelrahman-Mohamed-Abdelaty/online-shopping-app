import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {User} from "./user.model";

class Admin extends Model{
    static User: BelongsTo<Admin, User>;
    user: any;
    static modelName(){
        return 'admins'
    }
}

Admin.init(
    {
        userId:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
    },
    {
        sequelize,
        modelName:Admin.modelName(),
        timestamps: false,
    },
);
User.hasOne(Admin, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Admin.User = Admin.belongsTo(User,{as:'user'});
export  {Admin};