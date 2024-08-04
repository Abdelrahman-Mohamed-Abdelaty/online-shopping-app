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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = exports.generateSalt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const vendorSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    rating: { type: Number },
    coverImages: [String]
    // foods: [{ type: mongoose.SchemaTypes.ObjectId,ref:'food' }]
}, {
    timestamps: true,
    toJSON: {
        //prevent these fields from being selected
        transform(doc, ret) {
            delete ret.password,
                delete ret.salt,
                delete ret.__v,
                delete ret.createdAt,
                delete ret.updatedAt;
        }
    }
});
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () { return yield bcrypt_1.default.genSalt(); });
exports.generateSalt = generateSalt;
vendorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.salt = yield (0, exports.generateSalt)();
        this.password = yield bcrypt_1.default.hash(this.password, this.salt);
        next();
    });
});
exports.Vendor = mongoose_1.default.model('vendors', vendorSchema);
