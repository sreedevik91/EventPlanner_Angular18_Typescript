export interface registerData{
    name:string;
    email:string;
    username:string;
    password:string;
    mobile:number;
}

export interface loginData{
    username?:string;
    password?:string;
    name?:string;
    email?:string;
    googleId?:string;
}

export interface response{
    success:boolean;
    message:string;
}

export interface loggedUserData{
    _id:string;
    user:string;
    role:string;
    username:string;
    email:string;
}