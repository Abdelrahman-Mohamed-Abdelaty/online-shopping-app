import {DataTypes, Model} from 'sequelize'
import {AppError, catchAsync} from "../utility";


export const deleteFactory=(Model:Model)=>catchAsync (async (req,res,next)=>{
    const data= await Model.findByPk(req.params.id);
    if(!data){
        return next(new AppError("data is not found",404));
    }
    console.log(data.dataValues);
    await data.destroy();
    res.status(204).json({
        status:"success",
        data:null,
    })
})


export const createFactory=(Model:Model)=>catchAsync (async (req,res,next)=>{
    const document=await Model.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            document
        }
    })
})
export const updateFactory=(Model:Model)=>catchAsync(async (req,res,next)=>{
    const row = await Model.update(req.body,{
        where:{
            id:req.params.id
        }
    });
    if(!row){
        return next(new AppError("document is not found",404));
    }
    res.status(200).json({
        status:"success",
        data:{
            row
        }
    })
})

export const getOneFactory=(Model:Model)=>catchAsync (async (req,res,next)=>{
    const row=await Model.findByPk(req.params.id);
    if(!row){
        return next(new AppError("row is not found",404));
    }
    row!.password = undefined;
    row!.salt = undefined;
    res.status(200).json({
        status:"success",
        data:{
            row
        }
    })
})
export const getAllFactory=(model:Model)=>catchAsync(async (req,res,next)=>{
    const rows = await model.findAll();
    console.log(rows);
    res.status(200).json({
        status:"success",
        results:rows.length,
        data:{
            rows
        }
    })
});