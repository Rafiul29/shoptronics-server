const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const URI = process.env.MONGO_URI;
    mongoose.connect(URI, {useNewUrlParser: true }).then(() => {
      console.log("database connection successfully");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports=dbConnect;