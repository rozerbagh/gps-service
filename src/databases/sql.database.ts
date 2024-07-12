import { Sequelize } from "sequelize";
type ConnectionURLS = {
  connectionLimit: number;
  host: string;
  user: string;
  password: string;
  database: string;
  dialect: string;
  port: number;
  multipleStatements: boolean;
};
export const connectMYSQL = (dbURLs: ConnectionURLS): any => {
  const connectionURl = `${dbURLs.dialect}://${dbURLs.user}:${dbURLs.password}@${dbURLs.host}/${dbURLs.database}`;
  // console.log(connectionURl);
  const _Sequelize = new Sequelize(connectionURl);
  (async () => {
    try {
      await _Sequelize.authenticate();
    } catch (error) {
      throw Error("error");
    }
  })();
  return { sequilize: _Sequelize, DataTypes: Sequelize };
};
export default connectMYSQL;
