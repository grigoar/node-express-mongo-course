//We can use modules (like fs) to use in the file
//we have access to reading/writing to the file system
//we store the module in the fs variable so we can use later
const fs = require("fs");
const http = require("http");
const url = require("url");

//import our modules
const replaceTemplate = require("./modules/replaceTemplate");
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
///////////////////////////////////////////////////////////////////////////////
//----------------------------------ROUTING
//sending some response back when some request fire and hits the server

//if the execution is outside and it is syncrounous than it is executed in the beginning and it is not blocking anything
// const replaceTemplate = (temp, product) => {
//   //regular expressing and use it global to replace the name in all place where it is found
//   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%ID%}/g, product.id);

//   if (!product.organic)
//     output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

//   return output;
// };

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);
const server = http.createServer((req, res) => {
  // console.log(req.url);
  //url.parse gives us an object with the query and the pathname
  const { query, pathname } = url.parse(req.url, true);
  const pathName = req.url;

  //Overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObject
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    const product = dataObject[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    //better practice is to use dir that is available in node.js
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   //transform the string into an object with JSON.parse
    //   const productData = JSON.parse(data);
    //   res.writeHead(200, { "Content-type": "application/json" });
    //   res.end(data);
    // });
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //NOT FOUND
  } else {
    //Can write back a header to specify the problem
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }

  // res.end("Hello from the server!!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});

///////////////////////////////////////////////////////////////////////////////
//----------------------------------API
