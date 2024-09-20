import {DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {User} from "./user.model";

class Product extends Model{
    declare vendorId:number
    static modelName(){
        return 'products'
    }
}
Product.init(
    {
        id:{
            type:DataTypes.BIGINT,
            autoIncrement:true,
            primaryKey:true
        },
        vendorId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: 'vendor_name_unique_pair'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'vendor_name_unique_pair'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discountedPrice: {
            type: DataTypes.FLOAT,  // Number equivalent in Sequelize
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),  // Array of strings
                allowNull: false,
                validate: {
                notNull: { msg: "Product must have images" },
            },
        },
        sizes: {
            type: DataTypes.FLOAT,  // Sizes represented as numbers
        },
        offer: {
            type: DataTypes.FLOAT,  // Offer as a number (percentage or amount)
        },
        price: {
            type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                notNull: { msg: "Product should have a price" },
            },
        },
},
    {
        sequelize,
        modelName:Product.modelName(),
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
    },
);

User.hasMany(Product,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'vendorId'
})
Product.belongsTo(User,{
    foreignKey:'vendorId'
})
export  {Product};