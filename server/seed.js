const mongoose = require("mongoose");
const { Information, Admin, Domain, Product, Connection, Request, User } = require("./models");

const mongoURI = "mongodb://localhost:27017/my_goods";

const ADMINS = [
  { userId: "duyao1", password: "duyao1314" },
  { userId: "duyao2", password: "duyao1314" },
  { userId: "duyao3", password: "duyao1314" },
  { userId: "duyao4", password: "duyao1314" },
  { userId: "li1", password: "aa001314" },
  { userId: "li2", password: "aa001314" },
  { userId: "li3", password: "aa001314" },
  { userId: "ghost1", password: "qq001314" },
  { userId: "ghost2", password: "qq001314" },
  { userId: "ghost3", password: "qq001314" },
  { userId: "ghost4", password: "qq001314" },
  { userId: "ricky1", password: "ghost1314" },
  { userId: "ricky2", password: "ghost1314" },
  { userId: "ricky3", password: "ghost1314" },
  { userId: "ricky4", password: "ghost1314" },
  { userId: "ricky5", password: "ghost1314" },
];

const DOMAINS = [
  { value: 'http://pay-naver555.com', status: '사용가능'}
]

async function seedData() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany({});
    await Connection.deleteMany({});
    await Domain.deleteMany({});
    await Information.deleteMany({});
    await Request.deleteMany({});    
    await User.deleteMany({});
    await Admin.deleteMany({});

    for (let i = 0; i < ADMINS.length; i++) {
      await Admin.findOneAndUpdate({ userId: ADMINS[i].userId }, ADMINS[i], {
        upsert: true,
        new: true,
      });
    }

    for (let i = 0; i < DOMAINS.length; i++) {
      await Domain.findOneAndUpdate({ value: DOMAINS[i].value }, DOMAINS[i], {
        upsert: true,
        new: true,
      });
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

seedData();
