import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {User} from "./user.model";


class Customer extends Model{
    static User: BelongsTo<Customer, User>;
    user: any;
    static modelName(){
        return 'customers'
    }
}

Customer.init(
    {
        userId:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
    },
    {
        sequelize,
        modelName:Customer.modelName(),
        timestamps: false,
    },
);
User.hasOne(Customer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Customer.User = Customer.belongsTo(User,{as:'user'});
export  {Customer};