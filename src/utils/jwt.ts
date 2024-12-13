import jwt, {JwtPayload} from 'jsonwebtoken'

//payload informacin que queremos colocar en el jkt
export const generateJWT= (payload:JwtPayload)=>{

    const token= jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:'180d'    //el tiempo par que expire el JWT 
    })
    return token
}

export const verifyToken= (token:string)=>{ 
     const result = jwt.verify(token,process.env.JWT_SECRET)
     return result
    
}