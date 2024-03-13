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
  verifyOtpData,
  wrongResetPasswordData,
  wrongTestUserData,
} from "../authTestData";
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
      .post("/v1/auth/verify-otp")
      .send({
        ...verifyOtpData(resetPasswordOtp.code, "reset_password"),
        email: "abcdwsjg@email.com",
      });

    expect(body.message).toBe(
      "There was a problem at this time, pls wait some minutes"
    );
    expect(status).toBe(404);
  });

  it("Should throw error and indicate OTP is not verified", async () => {
    resetPasswordOtp.isVerified = false;
    await resetPasswordOtp.save();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/auth/verify-otp")
      .send(verifyOtpData("khdbc1", "reset_password"));

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("invalid verification code");
    expect(status).toBe(404);
  });

  it("Should throw error that otp has expired", async () => {
    resetPasswordOtp.isVerified = true;
    resetPasswordOtp.expireAt = new Date(Date.now() - 1000 * 60 * 30);
    await resetPasswordOtp.save();

    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/auth/verify-otp")
      .send(verifyOtpData(resetPasswordOtp.code, "reset_password"));

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("OTP has expired");
    expect(status).toBe(400);
  });

  it("Should indicate that otp verification has been completed", async () => {
    resetPasswordOtp.expireAt = new Date(Date.now() + 1000 * 60 * 60);
    await resetPasswordOtp.save();

    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/auth/verify-otp")
      .send(verifyOtpData(resetPasswordOtp.code, "reset_password"));

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe(
      "otp verification completed, proceed to reset your password"
    );
    expect(status).toBe(200);
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await OtpModel.deleteMany();
    await closeMongoDb();
  });
});
