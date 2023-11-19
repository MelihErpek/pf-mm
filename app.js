const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Configuration, OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", async (req, res) => {
  res.json("çalışıyor");
});







app.get("/getfile", async (req, res) => {
  const file = await openai.files.create({
    file: fs.createReadStream("data.jsonl"),
    purpose: "assistants",
  });
  res.json(file);
});

app.listen(5000, () => {
  console.log("Sunucu port 5000'de çalışıyor");
});


