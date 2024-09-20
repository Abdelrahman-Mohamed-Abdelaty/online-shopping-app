"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
class User extends sequelize_1.Model {
    static modelName() {
        return 'users';
    }
    isPasswordChangedRecent(jwtIssuedAtDate) {
        return this.dataValues.passwordChangedAt &&
            (this.dataValues.passwordChangedAt > new Date(jwtIssuedAtDate * 1000));
    }
    static findByPk(pk, options) {
        const _super = Object.create(null, {
            findByPk: { get: () => super.findByPk }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.findByPk.call(this, pk, options);
            result.password = undefined;
            result.salt = undefined;
            return result;
        });
    }
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 30],
        },
        set(value) {
            this.setDataValue('name', value.toLowerCase());
        }
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM,
        defaultValue: "customer",
        values: ['customer', 'vendor', 'admin', 'delivery']
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: 'email',
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        unique: 'salt',
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lat: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -90,
            max: 90,
        },
    },
    lon: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -180,
            max: 180,
        },
    },
    passwordChangedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - 2);
            return now;
        },
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    lastDelivery: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: '2024-01-01'
    },
    photo: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: User.modelName(),
});
