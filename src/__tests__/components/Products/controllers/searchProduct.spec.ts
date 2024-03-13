import request from "supertest";

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import AuthModel from "../../../../components/Auth/auth.model";
import { closeMongoDb } from "../../../../configs/database";
import { saveTestData } from "../../Auth/authTestData";
import { saveProductTestData } from "../productTestData";
import ProductModel from "../../../../components/Products/product.model";
import * as response from "../../../../utils/response";
import mongoose from "mongoose";

describe("Search a product", () => {
  let user: any, product: any, token: string;
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    user = await saveTestData().userAuth.save();
    token = user.generateToken({ data: { ref: user._id, role: user.role } });
  });

  describe("Should find a product By Id", () => {
    const randomId = new mongoose.Types.ObjectId();

    it("Should find a product By Id and throw error that product does not exist", async () => {
      const responseHandlerSpy = jest.spyOn(response, "responseHandler");

      const { body, status } = await request(app)
        .get(`/v1/product?productId=${randomId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(responseHandlerSpy).toHaveBeenCalled();
      expect(body.message).toBe("product does not exist");
      expect(status).toBe(400);
    });

    it("Should find a product By Id and returns it", async () => {
      product = await saveProductTestData().product(user._id).save();
      const responseHandlerSpy = jest.spyOn(response, "responseHandler");

      const { body, status } = await request(app)
        .get(`/v1/product?productId=${product._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(responseHandlerSpy).toHaveBeenCalled();
      expect(body.message).toBe("product retrieved successfully");
      expect(status).toBe(200);
    });
  });

  it("Should search for products that match some texts", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .get(`/v1/product?search=sfe`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("products retrieved successfully");
    expect(status).toBe(200);
  });

  it("Should find all the products in the database and retrieve them", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .get(`/v1/product`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("products retrieved successfully");
    expect(status).toBe(200);
  })

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await ProductModel.deleteMany();
    await closeMongoDb();
  });
});
