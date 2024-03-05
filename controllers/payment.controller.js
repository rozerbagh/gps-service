const Subscription = require("../models/subscription.model");
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});
async function createOrder(req, res) {
  try {
    const { amount } = req.body;
    var options = {
      amount: amount || 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };
    let orderDetails = null;
    instance.orders.create(options, function (err, order) {
      orderDetails = order;
      console.log(order);
      res.successResponse([...order], "Razorpay order has created!", 200);
    });
  } catch (err) {
    res.errorResponse(err, "Unable to subscribed", 500);
    return;
  }
}
const createSubscription = async () => {
  try {
    const { user, amount, expirydate, orderId } = req.body;
    const result = new Subscription({ user, amount, expirydate, orderId });
    const data = await result.save();
    res.successResponse([...data], "Subscription has been done !", 200);
  } catch (error) {
    res.errorResponse(err, "Unable to subscribed", 500);
    return;
  }
};
module.exports = {
  createOrder,
  createSubscription,
};
