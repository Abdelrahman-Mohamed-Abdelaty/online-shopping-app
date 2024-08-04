import mongoose from "mongoose";
import {CreateVendorInput} from '../dto'
import bcrypt from 'bcrypt'
export interface vendorDoc extends Document, CreateVendorInput {
}

const vendorSchema = new mongoose.Schema<vendorDoc>({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String},
    phone: { type: String, required: true ,unique:true},
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean},
    rating:{type:Number},
    coverImages:[String]
    // foods: [{ type: mongoose.SchemaTypes.ObjectId,ref:'food' }]
},{
    timestamps:true,
    toJSON:{
        //prevent these fields from being selected
        transform(doc,ret){
            delete ret.password,
            delete ret.salt,
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    }
});
export const generateSalt=async()=>await bcrypt.genSalt();

vendorSchema.pre('save',async function (next){
    if(!this.isModified('password')) return next();
    this.salt=await generateSalt();
    this.password=await bcrypt.hash(this.password,this.salt);
    next();
})

export const Vendor=mongoose.model<vendorDoc>('vendors',vendorSchema)