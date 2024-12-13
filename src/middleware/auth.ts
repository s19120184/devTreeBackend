import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { IUser, User } from "../Models/User";

//escribir sobre el request de express para comunicar el middelwere con la siguiente funcion que
//utilice el request
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("No autorizado");
    res.status(401).json({ error: error.message });
    return;
  }
  //obtener solo el token
  const [, token] = bearer.split(" ");

  if (!token) {
    const error = new Error("No autorizado");
    res.status(401).json({ error: error.message });
    return;
  }

  try {
    //verificamos que sea un token valido
    const result = verifyToken(token);
    console.log(result);

    //verificamos que el resultado sea de tipo objeto  y contenga un id
    if (typeof result === "object" && result.id) {
      //buscamos que exista el usuario
      //  const user = await User.findOne({_id: result.id}).select('name handel email')
      const user = await User.findOne({ _id: result.id }).select("-password"); //todo menos el password
      if (!user) {
        const error = new Error("El usuario no existe");
        res.status(404).json({ error: error.message });
        return;
      }
      //al tener declarado la interface de user podemos asignarle el user
      req.user = user;

      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Token no valido" });
  }
};
