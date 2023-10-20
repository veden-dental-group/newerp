import { Sequelize } from "sequelize";

const sequelizeClientSingleton = () => {
  return new Sequelize({
    dialect: "oracle",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    dialectModule: require("oracledb"),
  });
};

type SequelizeClientSingleton = ReturnType<typeof sequelizeClientSingleton>;

const globalForSequelize = globalThis as unknown as {
  sequelize: SequelizeClientSingleton | undefined;
};

const sequelize = globalForSequelize.sequelize ?? sequelizeClientSingleton();

export default sequelize;

if (process.env.NODE_ENV !== "production")
  globalForSequelize.sequelize = sequelize;
