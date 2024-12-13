import colors from "colors";
import mongoose, { Connection } from "mongoose";

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDataBase {
  static async conection(options: ConnectionOptions) {
    const { mongoUrl, dbName } = options;
    try {
      const conexion = await mongoose.connect(mongoUrl, {
        dbName: dbName
      });
      console.log(
        colors.cyan.bold(`Connected to mongoose" ${conexion.connection.host}`)
      );
    } catch (error) {
      throw new Error(colors.bgRed.white(`No MongoDB connection ${error}`));
    }
  }
}
