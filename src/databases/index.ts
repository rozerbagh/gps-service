import connect_mongodb from "./nosql.database";
import connect_MYSQL from "./sql.database";
import config from "../config";
let mongo = connect_mongodb({ nosqldburi: config.nosqldburi });
let sql = connect_MYSQL(config.sequelize);
console.log(sql);
export { mongo, sql };
