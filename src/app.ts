import { envs } from "./config/envs";
import { MongoDataBase } from "./data/mongo/init";
import { AppRoutes, Routes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  //conetarse a mongo
  await MongoDataBase.conection({
    mongoUrl: envs.MONGO_ATLAS,
    dbName: envs.MONGO_DB_NAME
  });
 
  const port = envs.PORT || 4000
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  });
  server.start();
}
