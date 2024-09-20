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
    id:number;
    email:string,
    password:string | undefined,
    name: string,
    lat:number,
    lon:number,
    role:string
}