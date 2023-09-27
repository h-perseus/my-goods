const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      userId: String,
      password: String,
      device: String,
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

const Admin = mongoose.model(
  "Admin",
  new Schema(
    {
      userId: String,
      password: String,
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

const Connection = mongoose.model(
  "Connection",
  new Schema(
    {
      ip: String,
      page: String,
      duration: Number,
      device: String,
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

const Domain = mongoose.model(
  "Domain",
  new Schema(
    {
      value: String,
      status: String,
      startedAt: Date,
      endedAt: Date,
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

const Information = mongoose.model(
  "Information",
  new Schema(
    {
      domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
      userId: String,
      password: String,
      discount: Number,
      fee: Number,
      deliveryFee: Number,
      seller: String,
      depositBank: String,
      depositDeadline: String,
      bankAccountNumber: String,
      accountHolder: String,
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

const Product = mongoose.model(
  "Product",
  new Schema(
    {
      name: String,
      image: String,
      price: Number,
      code: String,
      admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

const Request = mongoose.model(
  "Request",
  new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      userName: String,
      shippingAddress: String,
      shippingMemo: String,
      phone: String,
      phone1: String,
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

module.exports = {
  User,
  Connection,
  Domain,
  Information,
  Product,
  Request,
  Admin,
};
