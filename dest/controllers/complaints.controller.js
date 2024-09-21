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
exports.canDeleteComplaint = exports.canUpdateComplaint = exports.deleteStatusFromBody = exports.setCustomerId = exports.createComplaint = exports.getAllComplaints = exports.updateComplaint = exports.deleteComplaint = void 0;
const handlerFactory_1 = require("./handlerFactory");
const models_1 = require("../models");
const utility_1 = require("../utility");
exports.deleteComplaint = (0, handlerFactory_1.deleteFactory)(models_1.Complaint);
exports.updateComplaint = (0, handlerFactory_1.updateFactory)(models_1.Complaint);
exports.getAllComplaints = (0, handlerFactory_1.getAllFactory)(models_1.Complaint);
exports.createComplaint = (0, handlerFactory_1.createFactory)(models_1.Complaint);
const setCustomerId = (req, res, next) => {
    req.query.customerId = req.user.id.toString();
    req.body.customerId = req.user.id;
    next();
};
exports.setCustomerId = setCustomerId;
const deleteStatusFromBody = (req, res, next) => {
    delete req.body.status;
    next();
};
exports.deleteStatusFromBody = deleteStatusFromBody;
exports.canUpdateComplaint = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role === 'admin') {
        req.body = { status: req.body.status };
        return next();
    }
    const complaint = yield models_1.Complaint.findByPk(req.params.id).then(complaint => complaint === null || complaint === void 0 ? void 0 : complaint.toJSON());
    if (!complaint || complaint.customerId != req.user.id)
        return next(new utility_1.AppError('you dont\'t have such a complaint', 404));
    req.body = {
        message: req.body.message,
        topic: req.body.topic,
    };
    next();
}));
exports.canDeleteComplaint = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const complaint = yield models_1.Complaint.findByPk(req.params.id).then(complaint => complaint === null || complaint === void 0 ? void 0 : complaint.toJSON());
    if (!complaint || complaint.customerId != req.user.id)
        return next(new utility_1.AppError('you dont\'t have such a complaint', 404));
    next();
}));
