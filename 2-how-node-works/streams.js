const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //Solution 1
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });
  /////////////////////////
  //Solution 2: Streams
  //this creates backpressure, when the data read from the file can't be send quick enough to the client
  //   const readable = fs.createReadStream("test-file.txt");
  //   //when we get the data , we can write the data chunk by chunk
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });

  //   //when the data is read, then we can signal that the resource is already send
  //   readable.on("end", () => {
  //     res.end();
  //   });

  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("File not found");
  //   });

  //////////////////////---------------------------
  //Solution 3: streams with pipe
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //readableSource.pipe(writableDestination)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening....");
});
