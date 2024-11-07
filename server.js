const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const DB = process.env.DATABASE_URL;

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});

// handel unhandledRejection like database connection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  //server.close() give the server time to finish all the request that are still being handled then the server killed
  server.close(() => {
    process.exit(1);
  });
});
