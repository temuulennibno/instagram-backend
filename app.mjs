import express from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const users = [];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PORT = 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi mom");
});

app.post("/signup", (req, res) => {
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

  if (body.password.length < 8) {
    return res.status(400).send({ message: "Password must be greater than 8 characters" });
  }

  if (passwordRegex.test(body.password)) {
    return res.status(400).send({ message: "Password must include Upper and Lowercase letters and digit with special characters" });
  }

  const existingUser = users.find((user) => user.username === body.username);

  if (existingUser) {
    return res.status(400).send({ message: `User with username "${body.username}" already exists` });
  }

  const hashedPassword = bcrypt.hashSync(body.password, 10);

  const newUser = {
    id: nanoid(),
    fullname: body.fullname,
    username: body.username,
    email,
    phone,
    password: hashedPassword,
  };

  users.push(newUser);

  return res.send({ message: "Welcome to instagram", body: newUser });
});

app.post("/signin", (req, res) => {
  // TODO
  // 1. BODY WITH 2 FIELDS
  // 1.1 CREDENTIAL, PASSWORD
  // 1.1.1 CREDENTIAL CAN BE EMAIL OR PHONE OR USERNAME
  // IF 0 RECORD FOUND SEND 400 WITH MESSAGE
  const password = req.body.password;

  const isCorrectPassword = bcrypt.compareSync(password, "$2b$10$0bDVmBn1rDDwlbj7XF8gre1R4fcGuhOJjvRqlMR2EdJDHNrWyDT5S");
});

app.listen(PORT, () => {
  console.log(`Your app is running on http://localhost:${PORT}`);
});
