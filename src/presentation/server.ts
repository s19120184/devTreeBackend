import express, { Router } from "express";

import { corsConfig } from "../config/cors";
import cors from "cors";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  //instanciar express
  private app = express();
  private readonly port: number;
  private readonly routes: Router;

  //el constructor toma como valores el puerto y el router
  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }
  async start() {
    //*Middeleware
    this.app.use(cors(corsConfig));//instancia de cor

    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true }));

    //* routes
    this.app.use(this.routes);
    

    this.app.listen(this.port, () => {
      console.log("listening on port", this.port);
    });
  }
}
