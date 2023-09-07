const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config(path = "./.env");



const auth = require("./routes/auth");
const profile = require("./routes/profile");
const contestRouter = require("./routes/schedule");
const ratingRouter = require("./routes/rating");

router.use("/schedule", contestRouter);
router.use("/rating", ratingRouter);
router.use("/auth", auth);
router.use("/profile", profile);
router.get("/", (req, res) => {
  res.send("Hello World!");
});
router.post("/test", (req, res) => {
  console.log("test");
  console.log(req.body);
  res.send("Heelloo" + JSON.stringify(req.body));
});
app.use(cors({ origin: true, credentials: true }));
app.use("/", router);
// app.listen(7000, () => {
//   console.log("Server is running on port http://localhost:7000");
// });


const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_STRING;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
