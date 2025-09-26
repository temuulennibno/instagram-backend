import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const UserModel = mongoose.model("User", {
  username: String,
  fullname: String,
  email: String,
  password: String,
  phone: String,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PORT = 5500;

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hi mom");
});

app.post("/signup", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Body required" });
  }
  const body = req.body;
  if (!body.credential) {
    return res.status(400).send({ message: "Credential required" });
  }
  if (!body.password) {
    return res.status(400).send({ message: "Password required" });
  }
  if (!body.fullname) {
    return res.status(400).send({ message: "Fullname required" });
  }
  if (!body.username) {
    return res.status(400).send({ message: "Username required" });
  }

  let email = null;
  let phone = null;

  if (emailRegex.test(body.credential)) {
    email = body.credential;
  }
  if (!isNaN(Number(body.credential))) {
    phone = body.credential;
  }

  if (!email && !phone) {
    return res.status(400).send({ message: "Credential must be Email or Phone number!" });
  }

  if (email) {
    const existingUserByEmail = await UserModel.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).send({ message: "User with this email already exists" });
    }
  }

  if (phone) {
    const existingUserByPhone = await UserModel.findOne({ phone: phone });
    if (existingUserByPhone) {
      return res.status(400).send({ message: "User with this phone already exists" });
    }
  }

  if (body.password.length < 8) {
    return res.status(400).send({ message: "Password must be greater than 8 characters" });
  }

  if (passwordRegex.test(body.password)) {
    return res.status(400).send({ message: "Password must include Upper and Lowercase letters and digit with special characters" });
  }

  const existingUser = await UserModel.findOne({ username: body.username });

  if (existingUser) {
    return res.status(400).send({ message: `User with username "${body.username}" already exists` });
  }

  const hashedPassword = bcrypt.hashSync(body.password, 10);

  const newUser = {
    fullname: body.fullname,
    username: body.username,
    email,
    phone,
    password: hashedPassword,
  };

  const user = new UserModel(newUser);
  await user.save();

  return res.send({ message: "Welcome to instagram", body: user });
});

app.post("/signin", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Body required" });
  }
  const body = req.body;
  if (!body.credential) {
    return res.status(400).send({ message: "Credential required" });
  }
  if (!body.password) {
    return res.status(400).send({ message: "Password required" });
  }

  // const user = users.find((item) => {
  //   return item.email === body.credential || item.phone === body.credential || item.username === body.credential;
  // });

  const user = await UserModel.findOne({ $or: [{ email: body.credential }, { phone: body.credential }, { username: body.credential }] });

  if (!user) {
    return res.status(400).send({ message: "Wrong credentials!" });
  }

  console.log("User password:", user.password);
  console.log("Body password:", body.password);

  const isCorrectPassword = bcrypt.compareSync(body.password, user.password);

  if (!isCorrectPassword) {
    return res.status(400).send({ message: "Wrong password!" });
  }

  return res.send({ message: "You are signed in", body: user });
});

app.listen(PORT, () => {
  mongoose.connect(process.env.MONGO_URL);
  console.log(`Your app is running on http://localhost:${PORT}`);
});
