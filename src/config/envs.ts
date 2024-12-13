import 'dotenv/config'
import {get} from 'env-var'

//https://www.npmjs.com/package/env-var
//https://www.npmjs.com/package/dotenv

export const envs={
    PORT:get('PORT').required().asPortNumber(),

     //MONGO Db
     MONGO_URL:get('MONGO_URL').required().asString(),
     MONGO_DB_NAME:get('MONGO_DB_NAME').required().asString(),
     MONGO_USER:get('MONGO_USER').required().asString(),
     MONGO_PASS:get('MONGO_PASS').required().asString(),
     MONGO_ATLAS:get('MONGO_ATLAS').required().asString(),
     
}