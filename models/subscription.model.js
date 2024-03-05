const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subscriptionsSchema = new Schema(
  {
    orderId: {
      type: String,
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    expirydate: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subscriptions", subscriptionsSchema);
