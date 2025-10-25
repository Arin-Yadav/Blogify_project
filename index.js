const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const mongoose = require("mongoose");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!!"));

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allblogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allblogs,
  });
});

app.listen(PORT, () => {
  console.log(`Server started running on PORT: ${PORT}`);
});
