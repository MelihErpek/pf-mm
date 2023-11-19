const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
app.use(express.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: "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", // API anahtarını ortam değişkeninden al
});
const openai = new OpenAIApi(configuration);
const upload = multer({ dest: "uploads/" });

async function processPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const pdfText = await processPDF(req.file.path);
//     res.json({ text: pdfText });
//   } catch (error) {
//     console.error('PDF işleme hatası', error);
//     res.status(500).send('Sunucu hatası');
//   }
// });

app.post("/search", upload.single("file"), async (req, res) => {
  try {
    const  question  = "melih erpek universal mccan şirketinde çalışmış mıdır?";
    const pdfText = await processPDF(req.file.path);

    const { data: pdfEmbeddings } = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: pdfText,
    });

    const { data: questionEmbeddings } = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: question,
    });


    const similarity = cosineSimilarity(
      pdfEmbeddings.data[0].embedding,
      questionEmbeddings.data[0].embedding
    );

    if (similarity > 0.8) {
      res.json({ text: pdfText });
    } else {
      res.json({ text: "Soru ile ilgili bilgi bulunamadı." });
    }
  } catch (error) {
    console.error('Arama hatası', error);
    res.status(500).send(error);
  }
});

function cosineSimilarity(vecA, vecB) {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotproduct += (vecA[i] * vecB[i]);
    mA += (vecA[i] * vecA[i]);
    mB += (vecB[i] * vecB[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  const similarity = (dotproduct) / ((mA) * (mB));
  return similarity;
}
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const pdfText = await processPDF(req.file.path);
//     const embeddings = await openai.createEmbedding({
//       model: 'text-embedding-ada-002',
//       input: pdfText,
//     });
//     res.json(embeddings.data);
//   } catch (error) {
//     console.error('PDF işleme hatası', error.response.data);
//     res.status(500).send(error);
//   }
  
// });
app.listen(5000, () => {
  console.log("Sunucu port 5000'de çalışıyor");
});
// app.get("/converse", async (req, res) => {
//     const embedding = await openai.createEmbedding({
//         model: "text-embedding-ada-002",
//         input: "The quick brown fox jumped over the lazy dog",
//       });

//       res.send(embedding.data.data[0]);
// });

