import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {

  //origin quien quiere conectarse al servidor
  
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL];

    
    if (process.argv[2] === "--api") {
      whitelist.push(undefined);
    }

    if (whitelist.includes(origin)) {
      //primer parametro si existe un error
      //segundo si vamos a permitir la conexion
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  }
};
