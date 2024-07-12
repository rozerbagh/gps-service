import mongoose from "mongoose";

type ConnectionURLS = {
  nosqldburi: string;
};
export default function connect_mongodb(urls: ConnectionURLS): void {
  mongoose
    .connect(`${urls.nosqldburi}`)
    .then((connection): string => {
      return "";
    })
    .catch((error): void => {
      return
    });
}
