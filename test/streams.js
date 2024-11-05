const server = require("http").createServer();
const fs = require("fs");

server.on("request", (req, res, data) => {
  //   const readable = fs.createReadStream("text.txt");
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     res.end();
  //   });
  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.status(500);
  //     res.end("file not found");
  //   });

  // Solution 2

  // using the pipe operator to avoid backpressure issues
  const readable = fs.createReadStream("text.txt");
  readable.pipe(res);

  // readableSource.pipe(writableDestination);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
