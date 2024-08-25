"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeHandler = void 0;
const serializeHandler = (user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id }); // Pass the user's ID as a string
    });
};
exports.serializeHandler = serializeHandler;
