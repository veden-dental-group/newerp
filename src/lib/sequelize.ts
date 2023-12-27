import { Sequelize } from "sequelize";

const sequelizeClientSingleton = (user: string) => {
  let username = undefined;
  let password = undefined;
  if(user === 'erp'){
    username = process.env.DB_USER_ERP;
    password = process.env.DB_PASSWORD_ERP;
  }
  if(user === 'csp'){
    username = process.env.DB_USER_CSP;
    password = process.env.DB_PASSWORD_CSP;
  }
  return new Sequelize({
    dialect: "oracle",
    host: process.env.DB_HOST,
    username,
    password,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    dialectModule: require("oracledb"),
    pool:{
      min: 0,
      max: 10,
      acquire: 3000,
      idle: 10000,
    }
  });
};

type SequelizeClientSingleton = ReturnType<typeof sequelizeClientSingleton>;

const globalForSequelize = globalThis as unknown as {
  oracleCsp: SequelizeClientSingleton | undefined;
  oracleErp: SequelizeClientSingleton | undefined;
};

const oracleCsp = globalForSequelize.oracleCsp ?? sequelizeClientSingleton('csp');
const oracleErp = globalForSequelize.oracleErp ?? sequelizeClientSingleton('erp');

export  {oracleCsp, oracleErp};

if (process.env.NODE_ENV !== "production") globalForSequelize.oracleCsp = oracleCsp;
