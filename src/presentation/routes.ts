import { Router } from "express";
import { body, param } from "express-validator";

import { UserUseCase } from "../handlers/user-useCase";
import { ReviewUseCase } from "../handlers/review-useCase";
import { handleInputErrors } from "../middleware/userInputErros";
import { User } from "../Models/User";
import { authenticate } from "../middleware/auth";

export class Routes {
  static get routesRegistro(): Router {
    //instacia del router
    const router = Router();

    router.post(
      "/auth/register",
      body("handle").notEmpty().withMessage("Deves asignar un handle"),
      body("name").notEmpty().withMessage("Tu nombre no puede ir vacio"),
      body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("No es un email valido"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("El password debe contener al menos 8 caracteres"),

      handleInputErrors,
      UserUseCase.createUser
    );

    router.post(
      "/auth/login",
      body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("Email invalido"),
      body("password").isLength({ min: 8 }).withMessage("El passs es invalido"),
      handleInputErrors,
      UserUseCase.login
    );

    //rutas con autenticacion
    router.get('/user',
      authenticate,//middleware para autenticacion
      UserUseCase.getUser
    )

    router.patch('/user',
      body("handle").notEmpty().withMessage('El handle no puede ir vacio'),
      //body("description").notEmpty().withMessage('La descripción no puede ir vacia'),
      handleInputErrors,
      authenticate,
      UserUseCase.updateUser
    )

    //subir imagenes
    router.post('/user/imagen',
      authenticate,
      UserUseCase.uploadImage
    )

    //obterne usuario con su  handler
    router.get('/:handle',
 
      UserUseCase.getUserByHandle
    )

    //buscar si  handle esta disponible
    router.post('/search',
      body('handle')
         .notEmpty()
         .withMessage('El handle  no puede ir vacio'),
        
      handleInputErrors,

      UserUseCase.searchByHandle
    )






     // rutas para las reviews
    router.post(
      "/review/create",
      body("estrellas")
        .isNumeric()
        .notEmpty()
        .withMessage("Deve ir calidicado"),
      body("comentario").notEmpty().withMessage("Comentario es obligatorio"),
      body("nombreUsuario")
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio"),
      handleInputErrors,
      ReviewUseCase.createReview
    );

    router.get("/review", ReviewUseCase.getAllReviews);

    router.delete(
      "/review/:id",
      param("id").isMongoId().withMessage("El parametro no es valido"),
      handleInputErrors,
      ReviewUseCase.deleteReview
    );

    return router;
  }
}

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    //utilizamos clase Routes y su funcion routesRegistro
    router.use("/api", Routes.routesRegistro);
    return router;
  }
}
