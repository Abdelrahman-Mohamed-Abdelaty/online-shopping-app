import bcrypt from 'bcrypt'
import {User} from "../models";
export const serializeHandler = (user: User, cb: (err: any, id: { id: string }) => void) => {
    process.nextTick(() => {
        cb(null, {id:user.id!}); // Pass the user's ID as a string
    });
};
export const deserializeHandler = (user:User, cb:(err: any, id:User) => void) =>{
    process.nextTick(function() {
        // const user = findUserById(id);  // Look up the user by ID
        return cb(null, user);
    });
}
export const verifyUser=(_: any, profile: { id: string; emails: { value: string; }[]; displayName: string; }, cb: any)=> {
    console.log(profile)
    const user={
        id:profile.id,
        email:profile.emails[0].value,
        name:profile.displayName
    }
    console.log(user)
    cb(null,user);
}
export const googleStrategyOptions={
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3001/api/v1/users/oauth2/redirect/google',
    scope: ['profile', 'email']
}
export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

export const validatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await generatePassword(enteredPassword, salt) === savedPassword;
}
export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}