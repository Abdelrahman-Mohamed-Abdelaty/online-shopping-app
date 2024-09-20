import {Op} from "sequelize";

function convertOperators(obj: any) {
    const operatorMap:{ [key: string]: symbol } = {
        'gt': Op.gt,
        'gte': Op.gte,
        'lt': Op.lt,
        'lte': Op.lte
    }
    for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                const newObj = {} as {
                    [key: symbol | string]: any;
                };
                for (const [k, v] of Object.entries(value)) {
                    if (operatorMap[k]) {
                        newObj[operatorMap[k]] = v;
                    } else {
                        newObj[k] = v;
                    }
                }
                obj[key] = newObj;
            }
    }
    return obj;
}
export const QueryCreator = class {
    private readonly queryStr: any;
    query: {
        order?: string[][];
        where?: any;
        attributes?: string[];
        limit?:number;
        offset?:number;
    };
    constructor(queryStr:any) {
        this.queryStr = queryStr;
        this.query = {};
    }
    filter(){
        const queryObj = {...this.queryStr};
        const excludedFields=['sort','limit','page','fields'];
        excludedFields.forEach(field=>{
            delete queryObj[field];
        })
        this.query.where = convertOperators(queryObj);
        return this;
    }
    paginate(){
        this.query.limit = this.queryStr.limit*1 || 15
        if(!this.queryStr.page) this.queryStr.page = 1;
        this.query.offset = (this.queryStr.page-1)*this.query.limit;
        console.log("after paginate", this.query)
        return this;
    }
    limitFields(){
        if(this.queryStr.fields){
            this.query.attributes = this.queryStr.fields.split(',');
        }
        console.log("after limit fields",this.query)
        return this;
    }
    sort(){
        if(this.queryStr.sort){
            const sortByAttributes = this.queryStr.sort.split(',')
            this.query.order= [] as string[][];
            sortByAttributes.forEach((attribute:string)=>{
                this.query.order!.push(attribute.split('-'));
            })
        }else{
            this.query.order = [["createdAt","DESC"]]
        }
        console.log("after order",this.query);
        return this;
    }

}