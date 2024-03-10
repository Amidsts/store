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
  paystackSecret: env.PAYSTACK_SECRET,
  paystackPublicKey: env.PAYSTACK_PUBLIC_KEY,
  mailgunApiKey: env.MAILGUN_API_KEY,
  mailgunDomain: env.MAILGUN_DOMAIN,
  appEmail: env.APP_EMAIL,
};

export default appConfig;