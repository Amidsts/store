const request = require("supertest");

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
import AuthModel from "../../../../components/Auth/auth.model";
import { saveTestData, testUserData } from "../../../index.spec";

describe("user signup", () => {
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();
  });

  it("Should throw error if user already exist", async () => {
    await saveTestData().userAuth.save();

    const { body, status } = await request(app)
      .post("/v1/auth/signup")
      .send(testUserData);

    expect(body.message).toBe("Account already exists,please Login instead");
    expect(status).toBe(409);
  });

  it("should create a new user with a success message", async () => {
    await AuthModel.deleteMany();

    const { body, status } = await request(app)
      .post("/v1/auth/signup")
      .send(testUserData);

    expect(body.message).toBe("account created, please login");
    expect(status).toBe(200);
  });

  afterAll(async () => {
    await AuthModel.deleteMany();
    await closeMongoDb();
  });
});
