const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const { Configuration, OpenAI } = require("openai");
require("dotenv").config();
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", async (req, res) => {
const filePath = path.join(__dirname, 'data.jsonl');
  console.log(filePath)
  res.json("çalışıyor");
});







app.get("/getfile", async (req, res) => {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream("./data.jsonl"),
      purpose: "assistants",
    });
    res.json(file);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.listen(5000, () => {
  console.log("Sunucu port 5000'de çalışıyor");
});


