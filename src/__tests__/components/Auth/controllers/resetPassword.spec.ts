const request = require("supertest");

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
import AuthModel, { IAuth } from "../../../../components/Auth/auth.model";
import {
  saveTestData,
  testUserData,
  wrongOtpData,
  wrongTestUserData,
} from "../../../index.spec";
import OtpModel from "../../../../components/Auth/otp.model";
import * as sendEmail from "../../../../configs/mail/mailTemplates";
import * as response from "../../../../utils/response";

describe("reset user password", () => {
  //   let userAuth: any, resetPasswordOtp: any;
  let saveData = saveTestData();
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    await saveData.userAuth.save();
  });

  it("Should throw error for wrong email", async () => {
    const { body, status } = await request(app)
      .post("/v1/auth/reset-password")
      .send(wrongOtpData);

    expect(body.message).toBe("Invalid login credentials");
    expect(status).toBe(401);
  });

  it("Should throw error that indicate OTP does not exist", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/auth/reset-password")
      .send({ ...wrongOtpData, email: testUserData.email });

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("pls, verify password otp");
    expect(status).toBe(200);
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await OtpModel.deleteMany();
    await closeMongoDb();
  });
});
