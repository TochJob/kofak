import express from "express";

const PORT = 5000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
