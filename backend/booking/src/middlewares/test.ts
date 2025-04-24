import {sign, verify} from 'jsonwebtoken'

let data={
name:'sreedevi',
place:'xyz'
}

let secret='1223456'

async function generateToken(){
    let token=await sign(data,{key:'123456'})
    return token
}

let token =generateToken()

async function verifyToken(token:string) {

let verifiedToken= verify(token,{key:'123456'})
return verifiedToken
}

let token1='hhhjhj'

let verifiedToken= verify(token1,secret )

if(refreshToken && verifiedToken.expiresIn> 'tokenExpirationtime'){
    let newToken= sign(data,secret,{expiresIn:'1day'})
}

