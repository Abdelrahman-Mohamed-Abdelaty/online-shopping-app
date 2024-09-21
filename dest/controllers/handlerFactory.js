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
exports.getAllFactory = exports.getOneFactory = exports.updateFactory = exports.createFactory = exports.deleteFactory = void 0;
const utility_1 = require("../utility");
const queryCreator_1 = require("../utility/queryCreator");
const sequelize_1 = require("sequelize");
const deleteFactory = (Model, callNext) => (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = {
        id: {
            [sequelize_1.Op.eq]: req.params.id
        }
    };
    const count = yield Model.destroy({ where: whereClause });
    if (!count) {
        return next(new utility_1.AppError("data is not found", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
    if (callNext)
        next();
}));
exports.deleteFactory = deleteFactory;
const createFactory = (Model) => (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const row = yield Model.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            row
        }
    });
}));
exports.createFactory = createFactory;
const updateFactory = (Model, callNext) => (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body)
        return next(new utility_1.AppError('Please provide some data for updating', 400));
    const rowFound = yield Model.findByPk(req.params.id);
    if (!rowFound)
        return next(new utility_1.AppError("row is not found", 404));
    const whereClause = {
        id: {
            [sequelize_1.Op.eq]: req.params.id
        }
    };
    const [rowCount, row] = yield Model.update(req.body, {
        where: whereClause,
        returning: true,
    });
    if (!rowCount)
        return next(new utility_1.AppError("no field was updated", 400));
    res.status(200).json({
        status: "success",
        data: {
            row
        }
    });
    if (callNext) {
        next();
    }
}));
exports.updateFactory = updateFactory;
const getOneFactory = (Model) => (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const row = yield Model.findByPk(req.params.id);
    if (!row)
        return next(new utility_1.AppError("row is not found", 404));
    res.status(200).json({
        status: "success",
        data: {
            row
        }
    });
}));
exports.getOneFactory = getOneFactory;
const getAllFactory = (Model, callNext) => (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi");
    const query = new queryCreator_1.QueryCreator(req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .query;
    console.log(query);
    const rows = yield Model.findAll(query);
    console.log(rows);
    res.status(200).json({
        status: "success",
        results: rows.length,
        data: {
            rows
        }
    });
    if (callNext)
        next();
}));
exports.getAllFactory = getAllFactory;
