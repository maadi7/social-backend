const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
dotenv.config();

try {
  mongoose.connect(
    process.env.MONGO_DB_CONNECTION_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log(e);
}

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

app.listen(8800, () => {
  console.log("Server is Running");
});
