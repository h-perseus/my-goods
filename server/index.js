const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const {
  Product,
  User,
  Request,
  Domain,
  Connection,
  Information,
  Admin,
} = require("./models");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("../uploads"));

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
const DB_URI = "mongodb://localhost:27017/my_goods";
const PORT = 8003;

// define db
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected successfully to the MongoDB server");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads"); // Uploads will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const randomString = crypto.randomBytes(6).toString("hex");
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${randomString}.jpg`;
    cb(null, uniqueFileName); // Use the original filename
  },
});

const upload = multer({ storage });

//define entrypoint
app.post("/image_upload", upload.single("image"), async (req, res) => {
  try {
    res.json({
      path: `${process.env.API_URL}/uploads/${req.file.filename}`,
    });
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, image, code, price, admin } = req.body;

    const _product = new Product({ name, image, code, price, admin });
    await _product.save();

    res.json(_product);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, image, code, price } = req.body;
    const _product = await Product.findByIdAndUpdate(id, {
      name,
      image,
      code,
      price,
    });

    res.json(_product);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);

    res.json({});
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const admin = req.query.admin;
    const products = await Product.find({ admin: admin });
    res.json(products);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.json(product);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/products/getByCode/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const product = await Product.findOne({ code: code });
    res.json(product);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { userId, password, product } = req.body;

    const user = new User({
      userId,
      password,
      product,
      device: req.isMobile ? "mobile" : "pc",
    });
    await user.save();

    res.json(user);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const adminId = req.query.admin;
    const products = await Product.find({ admin: adminId });
    const users = await User.find({
      product: { $in: products.map((el) => el._id) },
    }).populate("product");
    res.json(users);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("product");
    res.json(user);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/admins/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findById(id);
    res.json(admin);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.json({});
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.post("/requests", async (req, res) => {
  try {
    const { product, username, password } = req.body;

    const user = new User({
      userId: username,
      password,
      product,
      device: req.isMobile ? "mobile" : "pc",
    });
    await user.save();

    const _request = new Request({ product, user: user._id });
    await _request.save();

    res.json(_request);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/requests", async (req, res) => {
  try {
    const adminId = req.query.admin;
    const products = await Product.find({ admin: adminId });
    const requests = await Request.find({
      userName: { $exists: true },
      phone: { $exists: true },
      product: { $in: products.map((el) => el._id) },
    }).populate(["user", "product"]);
    res.json(requests);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/requests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const request = await Request.findById(id).populate(["user", "product"]);
    res.json(request);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.put("/requests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { shippingAddress, shippingMemo, phone, phone1, userName } = req.body;
    const _request = await Request.findByIdAndUpdate(id, {
      shippingAddress,
      shippingMemo,
      phone,
      phone1,
      userName,
    });

    res.json(_request);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.delete("/requests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Request.findByIdAndDelete(id);
    res.json({});
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.post("/domains", async (req, res) => {
  try {
    const { value, status } = req.body;

    const domain = new Domain({ value, status });
    await domain.save();

    res.json(domain);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/domains", async (req, res) => {
  try {
    const domains = await Domain.find();
    res.json(domains);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/domains/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const domain = await Domain.findById(id);
    res.json(domain);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.put("/domains/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { value, status } = req.body;
    const domain = await Domain.findByIdAndUpdate(id, { value, status });

    res.json(domain);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});
app.delete("/domains/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Domain.findByIdAndDelete(id);
    res.json({});
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.post("/connections", async (req, res) => {
  try {
    const { page, product } = req.body;

    const ip = req.headers["x-forwarded-for"]
    console.log('connected ip address:', ip)
    
    let connection;

    if (page === "메인") {
      connection = await Connection.findOne({
        ip,
        page,
        device: req.isMobile ? "mobile" : "pc",
        product,
      }).sort({ updatedAt: -1 });
      if (connection) {
        return res.json(connection);
      }
    } else if (page === "주문서작성") {
      connection = await Connection.findOne({
        ip,
        page,
        device: req.isMobile ? "mobile" : "pc",
        product,
      }).sort({ updatedAt: -1 });
      if (connection) {
        return res.json(connection);
      } else {
        connection = await Connection.findOne({
          ip,
          page: "메인",
          device: req.isMobile ? "mobile" : "pc",
          product,
        }).sort({ updatedAt: -1 });
        if (connection) {
          return res.json(connection);
        }
      }
    } else if (page === "완료") {
      connection = await Connection.findOne({
        ip,
        page,
        device: req.isMobile ? "mobile" : "pc",
        product,
      }).sort({ updatedAt: -1 });
      if (connection) {
        return res.json(connection);
      } else {
        connection = await Connection.findOne({
          ip,
          page: "주문서작성",
          device: req.isMobile ? "mobile" : "pc",
          product,
        }).sort({ updatedAt: -1 });
        if (connection) {
          return res.json(connection);
        }
      }
    }

    connection = new Connection({
      ip,
      page,
      duration: 0,
      device: req.isMobile ? "mobile" : "pc",
      product,
    });
    await connection.save();

    res.json(connection);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/connections", async (req, res) => {
  try {
    const adminId = req.query.admin;
    const products = await Product.find({ admin: adminId });
    const connections = await Connection.find({
      product: { $in: products.map((el) => el._id) },
    }).populate("product");
    res.json(connections);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/connections/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const connection = await Connection.findById(id).populate("product");
    res.json(connection);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.put("/connections/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const connection = await Connection.findByIdAndUpdate(id, req.body);

    res.json(connection);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});
app.delete("/connections/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Connection.findByIdAndDelete(id);
    res.json({});
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/information", async (req, res) => {
  try {
    const information = await Information.findOne().populate("domain");
    res.json(information);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.put("/information", async (req, res) => {
  try {
    const information = await Information.findOneAndUpdate({}, req.body);
    res.json(information);
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const admin = await Admin.findOne({ userId, password });
    if (!admin) {
      throw new Error("아이디 비번이 정확하지 않습니다");
    }

    res.json({ adminId: admin._id });
  } catch (e) {
    res.status(422).json({ message: e.message });
  }
});

// define server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
exports = module.exports = app;
