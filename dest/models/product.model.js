"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Product extends sequelize_1.Model {
    static modelName() {
        return 'products';
    }
}
exports.Product = Product;
Product.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    vendorId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        unique: 'vendor_name_unique_pair'
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'vendor_name_unique_pair'
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    discountedPrice: {
        type: sequelize_1.DataTypes.FLOAT, // Number equivalent in Sequelize
    },
    images: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), // Array of strings
        allowNull: false,
        validate: {
            notNull: { msg: "Product must have images" },
        },
    },
    sizes: {
        type: sequelize_1.DataTypes.FLOAT, // Sizes represented as numbers
    },
    offer: {
        type: sequelize_1.DataTypes.FLOAT, // Offer as a number (percentage or amount)
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: { msg: "Product should have a price" },
        },
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Product.modelName(),
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
});
user_model_1.User.hasMany(Product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'vendorId'
});
Product.belongsTo(user_model_1.User, {
    foreignKey: 'vendorId'
});
