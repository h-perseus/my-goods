const mongoose = require("mongoose");
const { Information, Admin, Domain, Product, Connection, Request, User } = require("./models");

const mongoURI = "mongodb://localhost:27017/my_goods";

const ADMINS = [
  { userId: "duyao1-4", password: "duyao1314" },
  { userId: "li1-3", password: "aa001314" },
  { userId: "ghost1-4", password: "qq001314" },
  { userId: "ricky1-5", password: "ghost1314" },
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
