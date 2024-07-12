import mongoose, { Schema, Model } from "mongoose";
interface ISubscription {
  orderId: string;
  user: Schema.Types.ObjectId;
  amount: number;
  expirydate: string;
}
interface SubscriptionsDoc extends mongoose.Document {
  orderId: string;
  user: Schema.Types.ObjectId;
  amount: number;
  expirydate: string;
}
export interface SubscriptionsModelInterface extends Model<SubscriptionsDoc> {
  build(attr: ISubscription): SubscriptionsDoc;
}
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

const Subscriptions = mongoose.model<
  SubscriptionsDoc,
  SubscriptionsModelInterface
>("subscriptions", subscriptionsSchema);
subscriptionsSchema.statics.build = (attr: ISubscription) => {
  return new Subscriptions(attr);
};
export default Subscriptions;
