const mongoose = require("mongoose");
const { Information, Admin } = require("./models");

const mongoURI = "mongodb://localhost:27017/my_goods";

const ADMINS = [
  { userId: "orderspay-naver556", password: "12345" },
  { userId: "orderspay-naver557", password: "12345" },
  { userId: "orderspay-naver566", password: "12345" },
  { userId: "pay-naver555", password: "12345" },
  { userId: "pay-naver556", password: "12345" },
  { userId: "pay-naver557", password: "12345" },
  { userId: "pay-naver558", password: "12345" },
  { userId: "pay-naver559", password: "12345" },
  { userId: "pay-naver566", password: "12345" },
  { userId: "pay-naver567", password: "12345" },
];

async function seedData() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const information = await Information.findOne();
    if (!information) {
      await new Information({
        userId: "admin",
        password: "12345",
        discount: 0,
        fee: 1000,
        deliveryFee: 3000,
        seller: "5445motor(1001****)",
        depositBank: "가상계좌코드:토스뱅크",
        depositDeadline: "2023-09-06",
        bankAccountNumber: "1000-6920-3508",
        accountHolder: "차효정(주)N페이",
      }).save();
    }

    for (let i = 0; i < ADMINS.length; i++) {
      await Admin.findOneAndUpdate({ userId: ADMINS[i].userId }, ADMINS[i], {
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
