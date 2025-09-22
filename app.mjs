import express from "express";

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

  return res.send({ message: "Welcome to instagram" });
});

app.listen(PORT, () => {
  console.log(`Your app is running on http://localhost:${PORT}`);
});
