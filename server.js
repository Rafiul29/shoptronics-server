//external import
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config();

// internal import
const dbConnect = require("./config/dbConnect");
// const usersRouter = require("./routes/users.route");
const authRoutes = require("./routes/auth.Router");
const productRouter = require("./routes/products.Routes");
const categoriesRouter = require("./routes/categories.Router.js");
const brandRouter = require("./routes/brand.Routes");
const colorRouter = require("./routes/color.Routes.js");
const userRoutes = require("./routes/users.route.js");
const orderRoutes = require("./routes/orders.Routes.js");
const stripeRoutes = require("./routes/stripe.Routes");
// const reviewRouter = require("./routes/review.Routes");

const {
  globalErrorHandler,
  notFound,
} = require("./middlewares/globalErrorHandler");

// express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// bypass url
app.use("/api/auth/public", authRoutes);
app.use("/api/products/private", productRouter);
app.use("/api/categories/private", categoriesRouter);
app.use("/api/brands/private", brandRouter);
app.use("/api/colors/private", colorRouter);
app.use("/api/users/private", userRoutes);
app.use("/api/orders/private",orderRoutes);
app.use("/api/stripe", stripeRoutes);
// app.use("/api/reviews", reviewRouter);

// not found
app.use(notFound);
// error middleware
app.use(globalErrorHandler);

// database conection
dbConnect();

//listen server
const PORT = process.env.PORT || 4000;
app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});
