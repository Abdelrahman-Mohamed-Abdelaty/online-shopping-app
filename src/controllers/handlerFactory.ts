import {AppError, catchAsync} from "../utility";
import {QueryCreator} from "../utility/queryCreator";
import {ModelStatic, Model, WhereOptions, Op, Attributes} from "sequelize";
import {FindOptions} from "mongodb";

export const deleteFactory=<T extends Model>(Model: ModelStatic<T>,callNext?:boolean)=>catchAsync (async (req,res,next)=>{
    const whereClause = {
        id: {
            [Op.eq]: req.params.id
        }
    } as WhereOptions<T['_attributes']>;
    const count= await Model.destroy({where:whereClause});
    if(!count){
        return next(new AppError("data is not found",404));
    }
    res.status(204).json({
        status:"success",
        data:null,
    })
    if(callNext) next();
})

export const createFactory=<T extends Model>(Model: ModelStatic<T>)=>catchAsync (async (req,res,next)=>{
    const row=await Model.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            row
        }
    })
})

export const updateFactory=<T extends Model>(Model: ModelStatic<T>,callNext?:boolean)=>catchAsync(async (req,res,next)=>{
    if(!req.body)
        return next(new AppError('Please provide some data for updating',400))
    const rowFound = await Model.findByPk(req.params.id);
    if(!rowFound)
        return next(new AppError("row is not found",404));
    const whereClause = {
        id: {
            [Op.eq]: req.params.id
        }
    } as WhereOptions<T['_attributes']>;
    const [rowCount,row] = await Model.update(req.body,{
        where:whereClause,
        returning: true,
    });
    if(!rowCount)
        return next(new AppError("no field was updated",400));
    res.status(200).json({
        status:"success",
        data:{
            row
        }
    })
    if(callNext){
        next();
    }
})

export const getOneFactory=<T extends Model>(Model: ModelStatic<T>)=>catchAsync (async (req,res,next)=>{
    const row=await Model.findByPk(req.params.id);
    if(!row)
        return next(new AppError("row is not found",404));

    res.status(200).json({
        status:"success",
        data:{
            row
        }
    })
})
export const getAllFactory=<T extends Model>(Model:ModelStatic<T>,callNext?:Boolean)=>catchAsync(async (req,res,next)=>{
    console.log("hi")
    const query = new QueryCreator(req.query)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate()
                    .query as  FindOptions<Attributes<T>>;
    console.log(query)
    const rows = await Model.findAll(query);
    console.log(rows)
    res.status(200).json({
        status:"success",
        results:rows.length,
        data:{
            rows
        }
    })
    if(callNext)
        next();
});
