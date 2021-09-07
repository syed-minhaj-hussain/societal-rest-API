const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const { router: loginRouter } = require("./routes/login.router");
const { router: registerRouter } = require("./routes/register.router");
const { router: timelineRouter } = require("./routes/timeline.router");
const { router: userRouter } = require("./routes/user.router");
const { router: postRouter } = require("./routes/post.router");

const { startConnection } = require("./db.connect");
const PORT = process.env.PORT || 8080;

startConnection();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
// app.use(cors());
app.use(express.json());

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/timeline", timelineRouter);
app.use("/users", userRouter);
app.use("/post", postRouter);

app.get("/", (req, res) => res.json("Hi"));

app.listen(PORT, () => console.log(`server started at PORT : ${PORT}`));
