import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = validationResult(req);

  if (!error.isEmpty()) {
    res.status(400).json({ error: error.array() });

    return;
  }
  //si no existe ningun error continuamos con la siguiente funcion
  next();
};
