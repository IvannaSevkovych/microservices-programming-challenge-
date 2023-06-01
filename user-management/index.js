const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
const PORT = 8090;

app.use(express.json());

app.get("/users", (req, res) => {
  pool.query("SELECT * FROM public.users", (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const users = result.rows;
      res.status(200).json(users);
    }
  });
});

app.post("/users", (req, res) => {
  const { id, name, email } = req.body;

  // TODO add data validation

  pool.query(
    "INSERT INTO public.users (id, name, email) VALUES ($1, $2, $3) RETURNING id, name, email",
    [id, name, email],
    (error, result) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        const createdUser = result.rows[0];
        res.status(201).json(createdUser);
      }
    }
  );
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM public.users WHERE id = $1",
    [id],
    (error, result) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.rows.length === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          const user = result.rows[0];
          res.status(200).json(user);
        }
      }
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  pool.query(
    "UPDATE public.users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, result) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.rowCount === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json({ message: "User updated successfully" });
        }
      }
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "DELETE FROM public.users WHERE id = $1",
    [id],
    (error, result) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.rowCount === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json({ message: "User deleted successfully" });
        }
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
