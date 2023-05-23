const express = require("express");
const app = express();
const PORT = 8090;

const users = [];

app.use(express.json());

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.post("/users", (req, res) => {
  users.push(req.body);
  res.status(201).send(req.body);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const requestedUser = users.find((user) => user.id === id);
  res.status(200).send(requestedUser);
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  requestedUserIndex = users.findIndex((user) => user.id == id);
  users[requestedUserIndex] = req.body;

  res.status(200).send(`Updated user with id ${id} to ${req.body}`);
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  requestedUserIndex = users.findIndex((user) => user.id == id);
  users.splice(requestedUserIndex, 1);

  res.status(200).send(`User with id ${id} was deleted`);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
