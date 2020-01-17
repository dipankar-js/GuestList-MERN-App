const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// const connectDB = require("./config/db");
// connectDB();

//MongoDB Connection
const url = process.env.URL;
try {
  mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    () => {
      console.log("Connected to mongoDB");
    }
  );
} catch (err) {
  console.log(err.message);
}

//Middlewares
app.use(express.json({ extended: true }));

//routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/guests", require("./routes/guests"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
