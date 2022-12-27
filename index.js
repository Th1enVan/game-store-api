const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");

dotenv.config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connect to DB successfully!");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json())

app.use("/api/user", userRoute);

app.listen(process.env.PORT || 8000, () => {
  console.log("BE is running on port 8000!");
});
