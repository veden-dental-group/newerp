import { Sequelize } from "sequelize";

const sequelizeClientSingleton = () => {
  return new Sequelize({
    dialect: "oracle",
    host: "192.168.2.101",
    username: "mes",
    password: "VeDen_2023",
    database: "TEST",
    port: 1521,
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
