"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryCreator = void 0;
const sequelize_1 = require("sequelize");
function convertOperators(obj) {
    const operatorMap = {
        'gt': sequelize_1.Op.gt,
        'gte': sequelize_1.Op.gte,
        'lt': sequelize_1.Op.lt,
        'lte': sequelize_1.Op.lte
    };
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            const newObj = {};
            for (const [k, v] of Object.entries(value)) {
                if (operatorMap[k]) {
                    newObj[operatorMap[k]] = v;
                }
                else {
                    newObj[k] = v;
                }
            }
            obj[key] = newObj;
        }
    }
    return obj;
}
const QueryCreator = class {
    constructor(queryStr) {
        this.queryStr = queryStr;
        this.query = {};
    }
    filter() {
        const queryObj = Object.assign({}, this.queryStr);
        const excludedFields = ['sort', 'limit', 'page', 'fields'];
        excludedFields.forEach(field => {
            delete queryObj[field];
        });
        this.query.where = convertOperators(queryObj);
        return this;
    }
    paginate() {
        this.query.limit = this.queryStr.limit * 1 || 15;
        if (!this.queryStr.page)
            this.queryStr.page = 1;
        this.query.offset = (this.queryStr.page - 1) * this.query.limit;
        console.log("after paginate", this.query);
        return this;
    }
    limitFields() {
        if (this.queryStr.fields) {
            this.query.attributes = this.queryStr.fields.split(',');
        }
        console.log("after limit fields", this.query);
        return this;
    }
    sort() {
        if (this.queryStr.sort) {
            const sortByAttributes = this.queryStr.sort.split(',');
            this.query.order = [];
            sortByAttributes.forEach((attribute) => {
                this.query.order.push(attribute.split('-'));
            });
        }
        else {
            this.query.order = [["createdAt", "DESC"]];
        }
        console.log("after order", this.query);
        return this;
    }
};
exports.QueryCreator = QueryCreator;
