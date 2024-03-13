const request = require("supertest");

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
import AuthModel, { IAuth } from "../../../../components/Auth/auth.model";
import {
  resetPasswordData,
  saveTestData,
  testUserData,
  wrongResetPasswordData,
  wrongTestUserData,
} from "../../../index.spec";
import OtpModel from "../../../../components/Auth/otp.model";
import * as sendEmail from "../../../../configs/mail/mailTemplates";
import * as response from "../../../../utils/response";

describe("reset user password", () => {
  let user: any, resetPasswordOtp: any;
  let saveData = saveTestData();

  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    user = await saveData.userAuth.save();
    resetPasswordOtp = await saveData.resetPasswordOtp(user._id).save();
  });

  it("Should throw error for wrong email", async () => {
    const { body, status } = await request(app)
      .post("/v1/auth/reset-password")
      .send(wrongResetPasswordData);

    expect(body.message).toBe("Invalid login credentials");
    expect(status).toBe(401);
  });

  it("Should throw error and indicate OTP is not verified", async () => {
    resetPasswordOtp.isVerified = false;
    await resetPasswordOtp.save();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .patch("/v1/auth/reset-password")
      .send(resetPasswordData(resetPasswordOtp.code));

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("pls, verify password otp");
    expect(status).toBe(400);
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await OtpModel.deleteMany();
    await closeMongoDb();
  });
});
