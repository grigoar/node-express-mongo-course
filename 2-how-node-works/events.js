const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();
//this are the observers
myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Custromer name: grigoar");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

//the objects that emit the event
myEmitter.emit("newSale", 9);

///////////////////////////////////////////

const server = http.createServer();
server.on("request", (req, res) => {
  console.log("Request received");
  console.log(req.url);
  res.end("request received");
});

server.on("request", (req, res) => {
  console.log("Another request :)");
});

server.on("close", (req, res) => {
  console.log("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests");
});
