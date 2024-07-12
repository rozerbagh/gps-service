import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import Subscription from "../models/subscription.model";
import { CustomResponse } from "../interface/responseIntreface";
let instance = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});
async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount } = req.body;
    let options = {
      amount: amount || 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };
    let orderDetails = null;
    instance.orders.create(options, function (err: any, order: any) {
      orderDetails = order;
      // console.log(order);
      res.successResponse([...order], "Razorpay order has created!", 200);
    });
  } catch (err) {
    res.errorResponse(err, "Unable to subscribed", 500);
    return;
  }
}
const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, amount, expirydate, orderId } = req.body;
    const result = new Subscription({ user, amount, expirydate, orderId });
    const data = await result.save();
    res.successResponse([data], "Subscription has been done !", 200);
  } catch (error) {
    res.errorResponse(error, "Unable to subscribed", 500);
  }
};
module.exports = {
  createOrder,
  createSubscription,
};
