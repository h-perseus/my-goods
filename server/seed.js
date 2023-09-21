const mongoose = require("mongoose");
const { Information } = require("./models");

const mongoURI = "mongodb://localhost:27017/my_goods";

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

    await mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

seedData();
