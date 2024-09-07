import {DataTypes, Model} from 'sequelize'
import {AppError, catchAsync} from "../utility";
import {promises as fs} from "fs";

export const deleteFactory=(Model:Model)=>catchAsync (async (req,res,next)=>{
    const count= await Model.destroy({where:{id:req.params.id}});
    if(!count){
        return next(new AppError("data is not found",404));
    }
    res.status(204).json({
        status:"success",
        data:null,
    })
})


export const createFactory=(Model:Model)=>catchAsync (async (req,res,next)=>{
    const row=await Model.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            row
        }
    })
})
export const updateFactory=(Model:Model)=>catchAsync(async (req,res,next)=>{
    if(!req.body)
        return next(new AppError('Please provide some data for updating',400))
    const rowFound = await Model.findByPk(req.params.id);
    if(!rowFound)
        return next(new AppError("row is not found",404));
    const [rowCount,row] = await Model.update(req.body,{
        where:{
            id:req.params.id
        },
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
    if(req.body.images){
        const promises= rowFound.dataValues.images.map((image)=>{
            console.log(image);
            return fs.unlink(`public/img/products/${image}`)
        })
        await Promise.all(promises);
    }
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