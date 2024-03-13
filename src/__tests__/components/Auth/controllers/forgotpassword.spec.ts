const request = require("supertest");

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
import AuthModel, { IAuth } from "../../../../components/Auth/auth.model";
import { saveTestData, testUserData, wrongTestUserData } from "../authTestData";
import OtpModel from "../../../../components/Auth/otp.model";
import * as sendEmail from "../../../../configs/mail/mailTemplates";
import * as response from "../../../../utils/response";

describe("user forgot password test", () => {
  let userAuth: any;
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    ({ userAuth } = await saveTestData());
  });

  it("Should throw error for wrong email", async () => {
    const { body, status } = await request(app)
      .post("/v1/auth/forgot-password")
      .send({
        email: wrongTestUserData.email,
      });

    expect(body.message).toBe("Invalid login credentials");
    expect(status).toBe(401);
  });

  it("Should send otp code to the user's email", async () => {
    const sendEmailSpy = jest.spyOn(sendEmail, "default");
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/auth/forgot-password")
      .send({
        email: testUserData.email,
      });

    expect(sendEmailSpy).toHaveBeenCalled();
    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("verification code has been sent to your mail");
    expect(status).toBe(200);
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await OtpModel.deleteMany();
    await closeMongoDb();
  });
});
