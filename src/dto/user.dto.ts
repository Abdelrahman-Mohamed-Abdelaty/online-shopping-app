export interface IUser{
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    salt:string | undefined;
    serviceAvailable:boolean;
    coverImages:[string];
    rating:number;
    foods:any;
    id:string;
    email:string,
    _id:string,
    password:string | undefined,
    name: string,
    lat:number,
    lon:number,
    role:string
}