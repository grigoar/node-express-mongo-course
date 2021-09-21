//We can use modules (like fs) to use in the file
//we have access to reading/writing to the file system
//we store the module in the fs variable so we can use later
const fs = require("fs");
const http = require("http");

///////////////////////////////////////////////////////////////////////////////
//FILES
// ---------------- Synchronous and Asynchronous ways of doing operations for NODE.JS----------
//read from file Synchronous will block the execution
//Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`;
// //write in folder
// fs.writeFileSync("./txt/input.txt", textOut);
// console.log("File written");

//Non-blocking, asynchronous way
//as soon as the reading is done, Node.js will call the callback function we defined(error is usually the first argument)
//callback -hell but the principle that node works
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file was been written👌");
//       });
//     });
//   });
// });

// console.log("will read file");

///////////////////////////////////////////////////////////////////////////////
//----------------------------------SERVER
//sending some response back when some request fire and hits the server
const server = http.createServer((req, res) => {
  res.end("Hello from the server!!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
