import connect_mongodb from "./nosql.database";
import connect_MYSQL from "./sql.database";
import config from "../config";
const mongo = connect_mongodb({ nosqldburi: config.nosqldburi });
const sql = connect_MYSQL(config.sequelize);
// console.log(sql);
export { mongo, sql };
