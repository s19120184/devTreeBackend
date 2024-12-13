import { Request, Response } from "express";
import { User } from "../Models/User";
import { checkPassword, hashPassword, slug } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

import { v4 as uuid } from "uuid";

//para subir imagenes
import formidable from "formidable";
import cloudinary from "../config/cloudinay";
import { tracingChannel } from "diagnostics_channel";

export class UserUseCase {
  static async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      const UserExists = await User.findOne({ email: email });
      if (UserExists) {
        const error = new Error("El email ya esta registrado en esta pagina");
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.handle = slug(req.body.handle);

      const handleExists = await User.findOne({ handle: user.handle });
      if (handleExists) {
        const error = new Error("Este handle ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      console.log(user.handle);
      await user.save();

      res.status(201).send("Registro creado correctamente");
    } catch (error) {
      return res.json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("El usuario no existe");
      res.status(404).json({ error: error.message });
      return;
    }

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Password Incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    //enviar solo lo necesario para el jwt
    //en este caso con el id del usuario es suficientes
    //devemos mandarlo como un objeto
    const token = generateJWT({ id: user._id });

    res.send(token);
  }

  static async getUser(req: Request, res: Response): Promise<void> {
    res.json(req.user);
  }

  static async updateUser(req: Request, res: Response) {
    const { description, links } = req.body;

    try {
      //formatear handle
      const handle = slug(req.body.handle);
      //verificar que el andel no exista
      const handelExist = await User.findOne({ handle });

      if (
        handelExist &&
        handelExist._id.toString() !== req.user._id.toString()
      ) {
        res.status(409).json("El handle ya esta siendo usado");
        return;
      }
      req.user.description = description;
      req.user.handle = handle;
      req.user.links = links;
      //guardar al usuaio con la actualizacion
      await req.user.save();
      res.status(200).send("Perfil actualizado correctamente");
    } catch (error) {
      const e = new Error("Hubo un Error");
      res.status(500).json({ error: e.message });
      return;
    }
  }

  static async uploadImage(req: Request, res: Response) {
    const form = formidable({ multiples: false });

    try {
      form.parse(req, (error, fields, files) => {
        const routeFile = files.file[0].filepath;
        cloudinary.uploader.upload(
          routeFile,
          { public_id: uuid() }, //le asignamos otro id
          async function (error, result) {
            if (error) {
              const e = new Error("Hubo un Error al subir la imagen");
              res.status(500).json({ error: e.message });
              return;
            }
            if (result) {
              //guardar la imagen
              req.user.image = result.secure_url;
              await req.user.save();
              res.json({ image: result.secure_url });
            }
          }
        );
      });
    } catch (error) {
      const e = new Error("Hubo un Error");
      res.status(500).json({ error: e.message });
      return;
    }
  }

  static async getUserByHandle(req: Request, res: Response){
     try {
      //obtener datos desde los params de la url
      const { handle}=req.params;
      const user= await User.findOne({ handle: handle}).select('-_id -__v -password -email')
      if(!user){
        const error= new Error('El usuario no existe');
        res.status(404).json({ error: error.message });
        return
      }
      res.status(200).json(user)
      
     } catch (error) {
      const e = new Error("Hubo un Error");
      res.status(500).json({ error: e.message });
      return;
     }
  }

  static async searchByHandle(req: Request,res: Response) {
      try {
        
        const UserExists = await User.findOne({ handle: req.body.handle})
        if(UserExists){
          const error= new Error(`${req.body.handle} ya está registrado`)
          res.status(409).json({error: error.message})
          return
        }

        res.send(`${req.body.handle} Está disponible`)

        
      } catch (error) {
        const e = new Error("Hubo un Error");
        res.status(500).json({ error: e.message });
        return;
      }
  }
}
