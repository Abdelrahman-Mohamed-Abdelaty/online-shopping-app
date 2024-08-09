import mongoose from "mongoose"

export const connectToDatabase=async ()=>{
    mongoose
        .connect(process.env.MONGO_URI || 'error')
        .then(()=>console.log("connected to monogodb..."))
        .catch((err)=>console.log("error",err))
}
