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
exports.canDeleteNotification = exports.setRecepiantId = exports.deleteMyNotification = exports.updateNoticationsSeen = exports.getMyNotification = exports.deleteNotificationById = void 0;
const handlerFactory_1 = require("./handlerFactory");
const models_1 = require("../models");
const utility_1 = require("../utility");
exports.deleteNotificationById = (0, handlerFactory_1.deleteFactory)(models_1.Notification);
exports.getMyNotification = (0, handlerFactory_1.getAllFactory)(models_1.Notification, true);
exports.updateNoticationsSeen = (0, utility_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Notification.update({ seen: true }, {
        where: {
            to: req.user.id,
            seen: false
        }
    });
}));
exports.deleteMyNotification = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Notification.destroy({
        where: {
            to: req.user.id
        }
    });
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
const setRecepiantId = (req, res, next) => {
    req.query.to = req.user.id;
    next();
};
exports.setRecepiantId = setRecepiantId;
exports.canDeleteNotification = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield models_1.Notification.findByPk(req.params.id).then(obj => obj === null || obj === void 0 ? void 0 : obj.toJSON());
    if (!notification || notification.to !== req.user.id)
        return next(new utility_1.AppError('you dont\'t have such a notification', 404));
    next();
}));
