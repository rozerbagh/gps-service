import data from "./gpsdevice.json";
for (let i = 0; i <= data.length; i++) {
  try {
    // const buffer = Buffer.from(data[i]?.bufferData, "hex");
    // console.log(buffer.toString("utf8"));
    const buffer = Buffer.from(data[i]?.bufferData, "utf8"); // or use 'hex', 'base64' depending on your data format
    // console.log(buffer.toString());
  } catch (error) {
    // console.log(error);
  }

}
