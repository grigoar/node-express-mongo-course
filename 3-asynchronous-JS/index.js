const fs = require("fs");
const superagent = require("superagent");

//creating a Promise
//Promises have a constructor with resolve and reject, for what happens if the data is received or if an error is received
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find that file");
      //what we pass in resolve will be available in the then method
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("could not write file");
      resolve("success");
    });
  });
};

//Chaining the promises
//this returns a promise and we can use then on it
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    //this returns a promise and we can use then on it
    return superagent.get(`https://dog.ceo/api/breed/${data}/images`);
  })
  .then((res) => {
    console.log(res.body.message[0]);

    //this returns a promise and we can use then on it
    return writeFilePro("dog-img.txt", res.body.message);

    // fs.writeFile("dog-img.txt", res.body.message[0], (err) => {
    //   if (err) return console.log(err.message);
    //   console.log("Random dog image saved to file!");
    // });
  })
  .then(() => {
    console.log("RAndom dog image saved to file");
  })
  //the promise have the error to catch
  .catch((err) => {
    console.log(err.message);
  });

// readFilePro(`${__dirname}/dog.txt`).then((data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images`)
//     .then((res) => {
//       console.log(res.body.message[0]);

//       fs.writeFile("dog-img.txt", res.body.message[0], (err) => {
//         if (err) return console.log(err.message);
//         console.log("Random dog image saved to file!");
//       });
//     })
//     //the promise have the error to catch
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

//Promises instead of callbacks
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images`)
//     .then((res) => {
//       console.log(res.body.message[0]);

//       fs.writeFile("dog-img.txt", res.body.message[0], (err) => {
//         if (err) return console.log(err.message);
//         console.log("Random dog image saved to file!");
//       });
//     })
//     //the promise have the error to catch
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

//we are in the callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent.get(`https://dog.ceo/api/breed/${data}/images`).end((err, res) => {
//     if (err) return console.log(err.message);
//     console.log(res.body.message[0]);

//     fs.writeFile("dog-img.txt", res.body.message[0], (err) => {
//       if (err) return console.log(err.message);
//       console.log("Random dog image saved to file!");
//     });
//   });
// });
