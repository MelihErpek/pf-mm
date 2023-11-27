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
  res.json(filePath);
});



app.get("/json", async (req, res) => {
  const fs = require("fs");
  const response = await axios.get(
    "https://mirror.crwizard.com/mediamarkt/mediamarkt_features_feed.json"
  );
  let apiResponse;
  let modifiedJsonString = response.data.replace(/,(?=\s*\])/, "");
  apiResponse = JSON.parse(modifiedJsonString);
  let array = [];

  const jsonlString = JSON.stringify(apiResponse);
  // Dosyaya yazma
  for (let i = 0; i < apiResponse.length; i += 1000) {
    const part = apiResponse.slice(i, i + 1000);
    fs.writeFile(`mm_${i / 1000}.txt`, JSON.stringify(part, null, 2), (err) => {
      if (err) {
        console.error("Dosya yazılırken hata oluştu:", err);
      } else {
        console.log(`mm_${i / 565}.txt dosyası başarıyla oluşturuldu.`);
      }
    });
  }
  const file1 = await openai.files.create({
    file: fs.createReadStream("mm_1.txt"),
    purpose: "assistants",
  });
  const file2 = await openai.files.create({
    file: fs.createReadStream("mm_2.txt"),
    purpose: "assistants",
  });
  const file3 = await openai.files.create({
    file: fs.createReadStream("mm_3.txt"),
    purpose: "assistants",
  });
  const file4 = await openai.files.create({
    file: fs.createReadStream("mm_4.txt"),
    purpose: "assistants",
  });
  const file5 = await openai.files.create({
    file: fs.createReadStream("mm_5.txt"),
    purpose: "assistants",
  });
  const file6 = await openai.files.create({
    file: fs.createReadStream("mm_6.txt"),
    purpose: "assistants",
  });
 

  const myUpdatedAssistant = await openai.beta.assistants.update(
    "asst_R5pLesYS5Y6kIflkZkpzEgXs",
    {
      file_ids: [
        file1.id,
        file2.id,
        file3.id,
        file4.id,
        file5.id,
        file6.id,
      ],
    }
  );
  console.log(myUpdatedAssistant);
  res.json("İşlem tamamlandı.");
});



app.get("/getfile", async (req, res) => {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream("/var/task/data.jsonl"),
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


