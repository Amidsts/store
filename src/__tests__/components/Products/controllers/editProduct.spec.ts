import request from "supertest";

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import AuthModel from "../../../../components/Auth/auth.model";
import { closeMongoDb } from "../../../../configs/database";
import { saveTestData } from "../../Auth/authTestData";
import { productTestData, saveProductTestData } from "../productTestData";
import ProductModel from "../../../../components/Products/product.model";
import * as response from "../../../../utils/response";

describe("Delete a product", () => {
  let user: any, product: any, token: string;
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    user = await saveTestData().userAuth.save();
    product = await saveProductTestData().product(user._id).save();
    token = user.generateToken({ data: { ref: user._id, role: user.role } });
  });

  it("Should find a product with 'findOne()' and throw error that product does not exist", async () => {
    await ProductModel.deleteMany();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .put(`/v1/product`)
      .send({ ...productTestData, productId: product._id })
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("This product does not exist");
    expect(status).toBe(400);
  });

  it("Should find a product with 'findOne()' and edit", async () => {
    product = await saveProductTestData().product(user._id).save();
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .put(`/v1/product`)
      .send({
        ...productTestData,
        productId: product._id,
        name: "necklace",
        category: "accessories",
      })
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("product updated successfully");
    expect(status).toBe(200);
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await AuthModel.deleteMany();
    await ProductModel.deleteMany();
    await closeMongoDb();
  });
});
