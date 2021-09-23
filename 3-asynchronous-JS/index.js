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

/////////////-------------ASYNC -AWAIT
//Syntax sugar for Promises
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    //Multiple promises
    const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images`);

    const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images`);

    const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images`);

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message[0]);
    console.log(imgs);

    // const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images`);
    // console.log(res.body.message[0]);

    await writeFilePro("dog-img.txt", imgs.join("\n"));
    // await writeFilePro("dog-img.txt", res.body.message[0]);
    console.log("RAndom dog image saved to file");
  } catch (err) {
    console.log(err);
    //if we don't use throw then the next steps are executed
    //to mark all the function as rejected.
    throw err;
  }
  return "2: Ready";
};

//declaring an IFFY for handling the error
(async () => {
  try {
    console.log("1: Will get dog pics");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done get dog pics");
  } catch (err) {
    console.log(`ERROR  +${err}`);
  }
})();

// console.log("1: Will get dog pics");
// const x = getDogPic();
// getDogPic()
//   .then((x) => {
//     console.log(x);

//     console.log("3: Done get dog pics");
//   })
//   .catch((err) => {
//     console.log(`ERROR  +${err}`);
//   });
// console.log(x);
// console.log("3: Done get dog pics");

//Chaining the promises
//this returns a promise and we can use then on it
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     //this returns a promise and we can use then on it
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images`);
//   })
//   .then((res) => {
//     console.log(res.body.message[0]);

//     //this returns a promise and we can use then on it
//     return writeFilePro("dog-img.txt", res.body.message);

//     // fs.writeFile("dog-img.txt", res.body.message[0], (err) => {
//     //   if (err) return console.log(err.message);
//     //   console.log("Random dog image saved to file!");
//     // });
//   })
//   .then(() => {
//     console.log("RAndom dog image saved to file");
//   })
//   //the promise have the error to catch
//   .catch((err) => {
//     console.log(err.message);
//   });

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
