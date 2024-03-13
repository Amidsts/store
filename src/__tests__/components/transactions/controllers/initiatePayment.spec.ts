import request from "supertest";

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import AuthModel from "../../../../components/Auth/auth.model";
import ProductModel from "../../../../components/Products/product.model";
import { closeMongoDb } from "../../../../configs/database";
import { saveTestData } from "../../Auth/authTestData";
import * as response from "../../../../utils/response";
import { paymentData, saveTxTestData } from "../paymentTestData";
import mongoose from "mongoose";
import { saveProductTestData } from "../../Products/productTestData";
import TxModel from "../../../../components/transactions/transaction.model";
import * as payment from "../../../../components/transactions/transaction.utils";

describe("Initiate payment", () => {
  let user: any, product: any, token: string;
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    user = await saveTestData().userAuth.save();
    token = user.generateToken({
      data: { ref: user._id, role: user.role },
    });
  });

  it("Should find a product by Id and throw error that product is not found", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");
    const randomId = new mongoose.Types.ObjectId();

    const { body, status } = await request(app)
      .post(`/v1/tx/payment`)
      .send(paymentData(String(randomId)))
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("product not found");
    expect(status).toBe(404);
  });

  it("Should find a product by Id and throw error, because the loggedInUser is the owner of the product", async () => {
    product = await saveProductTestData().product(user._id).save();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post(`/v1/tx/payment`)
      .send(paymentData(String(product._id)))
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("you can not buy your own product");
    expect(status).toBe(400);
  });

  it("Should throw error indicating that 'product is out of stock or quantity is too high'", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");
    product.User = new mongoose.Types.ObjectId()
    await product.save()

    const { body, status } = await request(app)
      .post(`/v1/tx/payment`)
      .send({ ...paymentData(String(product._id)), quantity: 10000 })
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe(
      "product is out of stock or quantity is too high"
    );
    expect(status).toBe(400);
  });

  it("Should throw error indicating that payment has been completed", async () => {
    await saveTxTestData().transaction(product, user._id).save();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post(`/v1/tx/payment`)
      .send(paymentData(String(product._id)))
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("This payment has already been completed");
    expect(status).toBe(400);
  });

  it("Should make payment and return a successful response", async () => {
    await TxModel.deleteMany();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const createCustomerSpy = jest.spyOn(payment, "createCustomer");
    const initializePaymentSpy = jest.spyOn(payment, "initializePayment");

    const { body, status } = await request(app)
      .post(`/v1/tx/payment`)
      .send(paymentData(String(product._id)))
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(createCustomerSpy).toHaveBeenCalled();
    expect(initializePaymentSpy).toHaveBeenCalled();
    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("successful");
    expect(status).toBe(200);
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await ProductModel.deleteMany();
    await TxModel.deleteMany();
    await closeMongoDb();
  });
});
