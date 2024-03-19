const User = require("../../dataBase").User;
const names = [
  "Adam",
  "Piotr",
  "Bartosz",
  "Emil",
  "Robert",
  "Eustachy",
  "Tadeusz",
  "Jan",
  "Juliusz",
  "Ewa",
  "Teresa",
  "Kinga",
  "Małgorzata",
  "Elżbieta",
  "Justyna",
  "Teresa",
  "Julia",
];
const surnames = [
  "Kowalki",
  "Janik",
  "Janak",
  "Auchim",
  "Dąb",
  "Modrzew",
  "Nowak",
  "Chmiel",
  "Dąbrowski",
  "Zieliński",
  "Bolak",
];
const passwords = ["3ed$2s23%f", "3eds$%34ca", "332safg543cv", "dsaewQEFV653"];
const mailEndings = ["@o2.pl", "@onet.pl", "@wp.pl", "@gmail.com"];

async function init() {
  for (let i = 0; i < 4; i++) {
    const name = `${names[Math.floor(Math.random() * names.length)]}`;
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const startMail = name + surname;
    const password = passwords[Math.floor(Math.random() * passwords.length)];
    const mailEnding =
      mailEndings[Math.floor(Math.random() * mailEndings.length)];
    const fullName = ` ${name} ${surname}`;
    const mail = `${startMail + mailEnding}`;
    console.log(
      `startMail: ${startMail}, fullname: ${fullName}, mail: ${mail}`
    );
    const user = new User({
      name: fullName,
      password,
      mail,
    });
    await user.save();
  }
}

init();
