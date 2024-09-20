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
exports.generatePassword = exports.validatePassword = exports.generateSalt = exports.googleStrategyOptions = exports.verifyUser = exports.deserializeHandler = exports.serializeHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const serializeHandler = (user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id }); // Pass the user's ID as a string
    });
};
exports.serializeHandler = serializeHandler;
const deserializeHandler = (user, cb) => {
    process.nextTick(function () {
        // const user = findUserById(id);  // Look up the user by ID
        return cb(null, user);
    });
};
exports.deserializeHandler = deserializeHandler;
const verifyUser = (_, profile, cb) => {
    console.log(profile);
    const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
    };
    console.log(user);
    cb(null, user);
};
exports.verifyUser = verifyUser;
exports.googleStrategyOptions = {
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3001/api/v1/users/oauth2/redirect/google',
    scope: ['profile', 'email']
};
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.generateSalt = generateSalt;
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.generatePassword)(enteredPassword, salt)) === savedPassword;
});
exports.validatePassword = validatePassword;
const generatePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.generatePassword = generatePassword;
