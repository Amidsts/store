import AuthModel from "../components/Auth/auth.model";
import OtpModel from "../components/Auth/otp.model";

export const testUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "oreeyomi@gmail.com",
  password: "123_abc",
  phoneNo: "09044456788",
};
export const testOtpData = {};

export const wrongTestUserData = {
  email: "joha@email.com",
  password: "13$abcn",
};

export const wrongOtpData = {
  email: wrongTestUserData.email,
  password: "efghy78",
  confirmPassword: "efghy78",
  code: "abc234",
};

export function saveTestData() {
  return {
    userAuth: new AuthModel({
      ...testUserData,
      fullName: `${testUserData.firstName} ${testUserData.lastName}`,
    }),
    resetPasswordOtp: new OtpModel({
      User: this.userAuth._id,
      code: "123abc",
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: "reset_password",
    }),
  };
}
