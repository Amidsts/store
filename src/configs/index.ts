import "dotenv/config";
import ms from "ms";

const { env } = process;

const appConfig = {
  environment: env.NODE_ENV,
  port: env.PORT,
  mongoDbUri: env.MONGODB_URI,
  hashPepper: env.HASH_PEPPER,
  authConfigs: {
    saltRounds: 10,
    jwtSecret: env.JWT_SECRET || "",
    tokenLifeSpan: ms("1days"),
  },
};

export default appConfig;