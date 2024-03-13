const request = require("supertest");

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
import AuthModel from "../../../../components/Auth/auth.model";
import { saveTestData, testUserData, wrongTestUserData } from "../authTestData";
import * as response from "../../../../utils/response";

describe("user signin", () => {
  let user: any;
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    user = await saveTestData().userAuth.save();
  });

  it("Should throw error for wrong email", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app).post("/v1/auth/signin").send({
      email: wrongTestUserData.email,
      password: testUserData.password,
    });

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("Invalid login credentials");
    expect(status).toBe(401);
  });

  it("Should throw error for wrong wrong password", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app).post("/v1/auth/signin").send({
      email: testUserData.email,
      password: wrongTestUserData.password,
    });

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("Invalid login credentials");
    expect(status).toBe(401);
  });

  it("Should generate token and send user's data", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/auth/signin")
      .send({ email: testUserData.email, password: testUserData.password });

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("Login successful, Welcome 🤗");
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("token");
    expect(body.data).toHaveProperty("user");
    expect(typeof body.data.token).toBe("string");
    expect(typeof body.data.user).toBe("object");
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    
    await AuthModel.deleteMany();
    await closeMongoDb();
  });
});
