const baseData = require("../../dataBase.js");
const Movie = baseData.Movie;
const Restore = baseData.Restore;
const keys = baseData.keys;

async function makeCopyOfDuplicats(duplicats) {
  // makeCopyOfDuplicats and store data inside of restores collection
  await Restore.deleteMany();
  // create and get array of names and ides
  const names = await createArrayOfNames(duplicats);
  console.log(
    `duplicats array before deleting duplicated data: `,
    duplicats.length
  );
  // for each name check if there is any duplicat
  names.forEach(async (nameEle) => {
    const index = duplicats.findIndex((ele) => {
      return ele.id == nameEle.id;
    });
    duplicats.forEach(async (ele) => {
      if (ele.name == nameEle.name && ele._id !== nameEle.id) {
        const theSame = checkElements(duplicats[index], ele);
        if (theSame) {
          // if elements are the same delete element with specific index
          duplicats.splice(index, 1);
        }
      }
    });
  });
  console.log(
    `duplicats array after  deleting duplicated data: `,
    duplicats.length
  );

  duplicats.forEach(async (duplicat) => {
    const newRestoredData = {};
    keys.forEach((k) => {
      newRestoredData[k] = duplicat[k];
    });
    const newRestoredElement = new Restore(newRestoredData);
    await newRestoredElement.save();
  });
}

function checkElements(firstElement, lastElement) {
  // dup(-licats) array will contain boleans values true or false to check if firstElement and LastElement is the same
  let dup = [];

  keys.forEach((k) => {
    // for every property which has evey element of sent data is checked if firs element is the same what last element
    if (k == "genres") {
      //genres property which always is an array
      firstElement[k].forEach((g, index) => {
        // console.log(
        //   `if first ${k} -> ${g} : is equal to last ${k} -> ${
        //     lastElement[k][index]
        //   } --> ${g == lastElement[k][index]}`
        // );
        // console.log(
        //   `if first and last ${k}  equal->${g == lastElement[k][index]}`
        // );
        const answ = g == lastElement[k][index] ? true : false;
        dup.push(answ);
      });
    } else if (k == "image") {
      //image property which always is an object and properties veriable stands for array of properties
      const properties = Object.keys(firstElement[k]);
      properties.forEach((p) => {
        // console.log(
        //   `if first and last  ${p} : is equal ->${
        //     firstElement[k][p] === lastElement[k][p]
        //   }`
        // );
        const answ = firstElement[k][p] === lastElement[k][p] ? true : false;
        dup.push(answ);
      });
    } else {
      // for simple types of data
      // console.log(
      //   `if first and last ${k} is equal --> ${
      //     firstElement[k] === lastElement[k]
      //   }`
      // );
      const answ = firstElement[k] === lastElement[k] ? true : false;

      dup.push(answ);
    }
  });

  // there accure a problem with score property although elments are identical(images,titles,summary and other properties)
  // wirdly their score was different so below lines check if every other properties is different if so score is also true and the same . for while gives every value from dup array inside of others array except of score which is always element with 0 index inside of dup array.
  let others = [];
  for (let i = 1; i < dup.length; i++) {
    others.push(dup[i]);
  }
  others = others.every((e) => {
    return e;
  });
  // console.log(
  //   `for elements with Id: ${firstElement._id} and ${lastElement._id} `
  // );
  // if every other element is true so are the same then value of score also is true
  // console.log(`data for duplicats: `, dup);
  // console.log(`others: ${others}`);
  others ? (dup[0] = true) : "";
  // console.log(`data for duplicats after others: `, dup);

  // checking and sending if dup array cointains only true values
  return dup.every((e) => {
    return e;
  });
}

async function deleteDuplicat(id) {
  await Movie.findByIdAndDelete(id);
}
async function createArrayOfNames(data) {
  // takes array of elments from data and return array of names and ides
  const names = [];
  data.forEach(async (e) => {
    names.push({ name: e.name, id: e._id });
  });
  return names;
}

async function checkingForReplication(data) {
  const names = await createArrayOfNames(data);
  const duplicatsArray = [];
  // console.log(`there are ${names.length} names:`);

  names.forEach(async (nameEle) => {
    const index = data.findIndex((ele) => {
      return ele.id == nameEle.id;
    });
    data.forEach(async (ele) => {
      if (ele.name == nameEle.name && ele._id !== nameEle.id) {
        const theSame = checkElements(data[index], ele);

        if (theSame) {
          if (!duplicatsArray.includes(data[index])) {
            duplicatsArray.push(data[index]);
          }
          if (!duplicatsArray.includes(ele)) {
            await deleteDuplicat(ele._id);
          }
        }
      }
    });
  });

  duplicatsArray.length ? makeCopyOfDuplicats(duplicatsArray) : "";
}

async function checkingData(req, res, next) {
  let data = await Movie.find();

  if (typeof data[0] !== "undefined") {
    // console.log(`data length: ${data.length}`);
    await checkingForReplication(data);
    data = await Movie.find();
    if (typeof data[0] !== "undefined") {
      // console.log(`data length: ${data.length}`);
      // const skowron = data.filter((element) => element.image);
      // const index = skowron.findIndex((ele) => !ele.image);
      // console.log(`skowron[0]: ${skowron[0]} index: ${index}`);
      req.data = data.filter((element) => element.image);
      next();
    } else {
      // init(req,next);
      const data = await init();
      req.data = data.filter((element) => element.image);
      next();
    }
  } else {
    // init(req,next);
    const data = await init();
    req.data = data.filter((element) => element.image);
    next();
  }
}

async function init() {
  let data = await feedUpWithRestores();
  await checkingForReplication(data);
  data = await Movie.find();
  // console.log(`data length: ${data.length}`);
  return data;
}
async function feedUpWithRestores() {
  // we get data from resotres collection
  let data = await Restore.find();
  data.forEach(async (d) => {
    const restored = {};
    keys.forEach((k) => {
      restored[k] = d[k];
    });
    // we create new instance  (documents) of model  Movie and saving them into movies collection
    const movie = new Movie(restored);
    await movie.save();
  });
  // we sending back saved data from movies collection
  data = await Movie.find();
  console.log(`data restored: ${data.length} elements`);
  // res.send(data);
  return data;
}

module.exports.checkingData = checkingData;
module.exports.checkElements = checkElements;
