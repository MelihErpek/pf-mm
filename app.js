const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const cors = require("cors");
const axios = require("axios");
const { Configuration, OpenAI } = require("openai");
const csvParser = require("csv-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const openai = new OpenAI({
  apiKey: process.env.DB_HOST,
});
const upload = multer({ dest: "uploads/" });

async function processPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

function processData(product) {
  // return data.map((product) => {
  // Teknik özellikleri birleştirme
  // const features = product.FeatureItem.map((featureGroup) => {
  //   return featureGroup.SubFeatureItem.map((subFeature) => {
  //     return `${subFeature.SubFeatureName}: ${subFeature.SubFeatureValue}`;
  //   }).join(", ");
  // }).join("; ");

  // Ürün bilgilerini birleştirme
  return {
    name: product.customerFriendlyName,
    brand: product.productBrand,
    category: product.productCategory,
    price: product.salesPrice,
    stock: product.stock,
    description: product.DescriptionShort,
    // features: features,
    // fullDescription: `${product.customerFriendlyName}, ${product.productBrand}, ${features}. ${product.DescriptionShort}`,
    fullDescription: `${product.customerFriendlyName}, ${product.productBrand},${product.DescriptionShort}`,
  };
  // });
}

app.get("/filter", async (req, res) => {
  res.json(
    `[{"article": "1219364", "ean": "8806092839250", "masterDataName": "Galaxy S21 FE 128GB Akıllı Telefon Yeşil ", "customerFriendlyName": "SAMSUNG Galaxy S21 FE 128GB Akıllı Telefon Yeşil ", "productBrand": "SAMSUNG", "primaryImage": "ASSET_MMS_90557001", "imageList": "ASSET_MMS_90557001,ASSET_MMS_90556955,ASSET_MMS_90556959,ASSET_MMS_90556960,ASSET_MMS_90556963,ASSET_MMS_90556965,ASSET_MMS_90556968,ASSET_MMS_90556970,ASSET_MMS_90557000,ASSET_MMS_90558482", "url": "//www.mediamarkt.com.tr/tr/product/_samsung-galaxy-s21-fe-128gb-akıllı-telefon-yeşil-1219364.html", "availabilityLeadTime": "", "categoryId": "796041", "catEntryId": "7764539", "productCategory": "Telefon > Cep Telefonları > Android Telefonlar > Samsung Telefon", "salesPrice": "18999.0", "shippingPrice": "19.9", "stock": "no_stock", "Barcode": "8806092839250", "DescriptionLong": "", "DescriptionShort": "Galaxy S21 FE 128GB Akıllı Telefon Yeşil  fiyatı ve özelliklerini incelemek için hemen tıkla, sen de kazananlar kulübüne katıl. Kazananlar MediaMarkt'ta!", "FeatureItem": [{"FeatureId": "FET_GRP_1090_1040", "FeatureName": "Teknik özellikler", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_16437", "SubFeatureName": "SIM-kart boyutu", "SubFeatureValue": "Nano-SIM (4FF)"}, {"SubFeatureId": "PROD_FEAT_10990", "SubFeatureName": "Ürün Tipi", "SubFeatureValue": "Akıllı Telefon"}, {"SubFeatureId": "PROD_FEAT_13988", "SubFeatureName": "Maksimum Arttırılabilir Hafıza", "SubFeatureValue": "1"}, {"SubFeatureId": "PROD_FEAT_10450", "SubFeatureName": "İşletim Sistemi", "SubFeatureValue": "Android"}, {"SubFeatureId": "PROD_FEAT_11793", "SubFeatureName": "İşlemci", "SubFeatureValue": "Exynos 2100"}, {"SubFeatureId": "PROD_FEAT_12112", "SubFeatureName": "Arttırılabilir Hafıza", "SubFeatureValue": "Hayır"}, {"SubFeatureId": "PROD_FEAT_16155", "SubFeatureName": "Bellek Kapasitesi", "SubFeatureValue": "128"}, {"SubFeatureId": "PROD_FEAT_11184", "SubFeatureName": "RAM Bellek Boyutu", "SubFeatureValue": "8"}, {"SubFeatureId": "PROD_FEAT_11791", "SubFeatureName": "İşlemci Hızı", "SubFeatureValue": "Octa-core (1x2.84 GHz Cortex-X1 & 3x2.42 GHz Cortex-A78 & 4x1.80 GHz Cortex-A55)"}]}, {"FeatureId": "FET_GRP_1090_0330", "FeatureName": "Ekran", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_10649", "SubFeatureName": "Ekran", "SubFeatureValue": "6.4'' FHD+ (1080x2400)"}, {"SubFeatureId": "PROD_FEAT_14112", "SubFeatureName": "Ekran Boyutu (inç)", "SubFeatureValue": "6.4"}, {"SubFeatureId": "PROD_FEAT_10317", "SubFeatureName": "Çözünürlük genişliği", "SubFeatureValue": "1080"}, {"SubFeatureId": "PROD_FEAT_15799", "SubFeatureName": "Ekran boyutu cm / inç", "SubFeatureValue": "16.4 cm / 6.4 inç"}, {"SubFeatureId": "PROD_FEAT_10319", "SubFeatureName": "Çözünürlük yüksekliği", "SubFeatureValue": "2400"}, {"SubFeatureId": "PROD_FEAT_14111", "SubFeatureName": "Ekran boyutu(cm)", "SubFeatureValue": "16.4"}, {"SubFeatureId": "PROD_FEAT_15798", "SubFeatureName": "Çözünürlük (YxG)", "SubFeatureValue": "2400 x 1080 pixels"}]}, {"FeatureId": "FET_GRP_1090_0100", "FeatureName": "Kamera", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_10354", "SubFeatureName": "Otomatik odaklanma", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_14973", "SubFeatureName": "Ön Kamera Çözünürlüğü", "SubFeatureValue": "32"}, {"SubFeatureId": "PROD_FEAT_15379", "SubFeatureName": "HD Video Kayıt", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_11209", "SubFeatureName": "Entegre flaş", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_11007", "SubFeatureName": "Yüz Tanıma", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_16697", "SubFeatureName": "Arka kamera", "SubFeatureValue": "Triple Cam"}, {"SubFeatureId": "PROD_FEAT_10624", "SubFeatureName": "Dijital Zoom", "SubFeatureValue": "30x"}, {"SubFeatureId": "PROD_FEAT_11707", "SubFeatureName": "Optik Zoom", "SubFeatureValue": "Hayır"}, {"SubFeatureId": "PROD_FEAT_16698", "SubFeatureName": "Arka kamera çözünürlüğü", "SubFeatureValue": "12"}, {"SubFeatureId": "PROD_FEAT_16703", "SubFeatureName": "Arka Kamera Özellikleri", "SubFeatureValue": "12MP+12MP+ 8MP"}]}, {"FeatureId": "FET_GRP_1090_0480", "FeatureName": "Fonksiyonları", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_10851", "SubFeatureName": "Parmak İzi Sensörü", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_15380", "SubFeatureName": "Coğrafi etiketleme", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_11679", "SubFeatureName": "Acil durum çağrı fonksiyonu", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_11257", "SubFeatureName": "GPS", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_13874", "SubFeatureName": "Çift SİM", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_15385", "SubFeatureName": "Dahili Radyo", "SubFeatureValue": "Evet"}]}, {"FeatureId": "FET_GRP_1090_0300", "FeatureName": "Veri + bağlantılar", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_12484", "SubFeatureName": "WİFİ", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_16701", "SubFeatureName": "Mobil phone standard", "SubFeatureValue": "5G"}, {"SubFeatureId": "PROD_FEAT_14004", "SubFeatureName": "NFC (Yakın Alan) Desteği", "SubFeatureValue": "Hayır"}, {"SubFeatureId": "PROD_FEAT_15771", "SubFeatureName": "Bluetooth", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_10134", "SubFeatureName": "Bağlantılar", "SubFeatureValue": "Qualcomm Snapdragon 865 2.84 GHz"}, {"SubFeatureId": "PROD_FEAT_10496", "SubFeatureName": "Bluetooth Sürümü", "SubFeatureValue": "Bluetooth 5.0"}]}, {"FeatureId": "FET_GRP_1090_0550", "FeatureName": "Gövde", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_14398", "SubFeatureName": "Tasarım", "SubFeatureValue": "Süper Amoled"}, {"SubFeatureId": "PROD_FEAT_16110", "SubFeatureName": "Genişlik", "SubFeatureValue": "74.5"}, {"SubFeatureId": "PROD_FEAT_16333", "SubFeatureName": "Ağırlık", "SubFeatureValue": "177"}, {"SubFeatureId": "PROD_FEAT_16112", "SubFeatureName": "Derinlik", "SubFeatureValue": "7.9"}, {"SubFeatureId": "PROD_FEAT_00003", "SubFeatureName": "Renk (temel)", "SubFeatureValue": "Yeşil"}, {"SubFeatureId": "PROD_FEAT_16111", "SubFeatureName": "Yükseklik", "SubFeatureValue": "155.7"}, {"SubFeatureId": "PROD_FEAT_12083", "SubFeatureName": "Su sıçramasına dayanıklı", "SubFeatureValue": "Evet"}, {"SubFeatureId": "PROD_FEAT_10812", "SubFeatureName": "Renk (Üreticiye Göre)", "SubFeatureValue": "Yeşil"}]}, {"FeatureId": "FET_GRP_1090_0840", "FeatureName": "Güç kaynağı", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_10396", "SubFeatureName": "Batarya Tipi", "SubFeatureValue": "Lityum iyon"}, {"SubFeatureId": "PROD_FEAT_16295", "SubFeatureName": "Batarya kapasitesi", "SubFeatureValue": "4500"}]}, {"FeatureId": "FET_GRP_1090_0500", "FeatureName": "Genel özellikleri", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_15806", "SubFeatureName": "Boyutlar (GxYxD) / Ağırlık", "SubFeatureValue": "74.5 mm x 155.7 mm x 7.9 mm / -"}, {"SubFeatureId": "PROD_FEAT_13648", "SubFeatureName": "Ürün belgeleri", "SubFeatureValue": "Garanti Belgesi"}, {"SubFeatureId": "PROD_FEAT_14702", "SubFeatureName": "Ambalaj Derinliği", "SubFeatureValue": "8.44"}, {"SubFeatureId": "PROD_FEAT_14703", "SubFeatureName": "Çevre Ölçüsü", "SubFeatureValue": "32.568 cm"}, {"SubFeatureId": "PROD_FEAT_14704", "SubFeatureName": "Ambalajlı Ağırlık", "SubFeatureValue": "189"}, {"SubFeatureId": "PROD_FEAT_18008", "SubFeatureName": "Üretim Yeri", "SubFeatureValue": "Vietnam"}, {"SubFeatureId": "PROD_FEAT_14700", "SubFeatureName": "Ambalaj Genişliği", "SubFeatureValue": "74.5"}, {"SubFeatureId": "PROD_FEAT_14701", "SubFeatureName": "Ambalaj Yüksekliği", "SubFeatureValue": "159.8"}, {"SubFeatureId": "PROD_FEAT_15516", "SubFeatureName": "Ambalaj Boyutu", "SubFeatureValue": "74.5 mm / 159.8 mm / 8.44 mm"}, {"SubFeatureId": "PROD_FEAT_11470", "SubFeatureName": "Kutu İçeriği", "SubFeatureValue": "Şarj Aleti, Kullanım Kılavuzu"}, {"SubFeatureId": "PROD_FEAT_16208", "SubFeatureName": "Üretici Garantisi", "SubFeatureValue": "2 Yıl Samsung Türkiye Garantili"}]}], "MPG": "0", "PG": "3902", "ProductName": "GALAXY S21 FE 5G 128 GB YESIL", "SalesPrice": "", "id": "1219364"},{"article": "1220601", "ean": "8682279236759", "masterDataName": "Premium Kapsül Kahve 7 Italy Nesproesso Uyumlu", "customerFriendlyName": "SIRIUS Premium Kapsül Kahve 7 Italy Nesproesso Uyumlu", "productBrand": "SIRIUS", "primaryImage": "ASSET_MMS_92671098", "imageList": "ASSET_MMS_92671098,ASSET_MMS_92671087,ASSET_MMS_92671089", "url": "//www.mediamarkt.com.tr/tr/product/_sirius-premium-kapsül-kahve-7-italy-nesproesso-uyumlu-1220601.html", "availabilityLeadTime": "<li>Stoktan Gönderi <span class=\"icon icon-info\" data-layer=\"StoktanGonderi\"></span></li>", "categoryId": "806542", "catEntryId": "7890897", "productCategory": "Ev Aletleri & Yaşam > Kahve & Çay > Kahveler", "salesPrice": "89.99", "shippingPrice": "19.9", "stock": "in_stock", "Barcode": "8682279236759", "DescriptionLong": "", "DescriptionShort": "Premium Kapsül Kahve 7 Italy Nesproesso Uyumlu fiyatı ve özelliklerini incelemek için hemen tıkla, sen de kazananlar kulübüne katıl. Kazananlar MediaMarkt'ta!", "FeatureItem": [{"FeatureId": "FET_GRP_1179_0410", "FeatureName": "Ekipman", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_15516", "SubFeatureName": "Ambalaj Boyutu", "SubFeatureValue": "28 cm / 3.5 cm / 3.5 cm"}, {"SubFeatureId": "PROD_FEAT_14700", "SubFeatureName": "Ambalaj Genişliği", "SubFeatureValue": "28"}, {"SubFeatureId": "PROD_FEAT_14701", "SubFeatureName": "Ambalaj Yüksekliği", "SubFeatureValue": "3.5"}, {"SubFeatureId": "PROD_FEAT_14702", "SubFeatureName": "Ambalaj Derinliği", "SubFeatureValue": "3.5"}, {"SubFeatureId": "PROD_FEAT_12026", "SubFeatureName": "Çeşit", "SubFeatureValue": "Kapsül Kahve"}, {"SubFeatureId": "PROD_FEAT_14703", "SubFeatureName": "Çevre Ölçüsü", "SubFeatureValue": "42 cm"}, {"SubFeatureId": "PROD_FEAT_16333", "SubFeatureName": "Ağırlık", "SubFeatureValue": "55"}, {"SubFeatureId": "PROD_FEAT_10990", "SubFeatureName": "Ürün Tipi", "SubFeatureValue": "Kapsül Kahve"}, {"SubFeatureId": "PROD_FEAT_16206", "SubFeatureName": "Base price defined in", "SubFeatureValue": "kg başına fiyatı"}, {"SubFeatureId": "PROD_FEAT_16205", "SubFeatureName": "Baseprice factor", "SubFeatureValue": "18.181818181818183"}, {"SubFeatureId": "PROD_FEAT_16204", "SubFeatureName": "Baseprice unit", "SubFeatureValue": "kg"}, {"SubFeatureId": "PROD_FEAT_16203", "SubFeatureName": "Baseprice amount", "SubFeatureValue": "0.055"}, {"SubFeatureId": "PROD_FEAT_16202", "SubFeatureName": "Satış Hacmi", "SubFeatureValue": "55"}, {"SubFeatureId": "PROD_FEAT_14704", "SubFeatureName": "Ambalajlı Ağırlık", "SubFeatureValue": "55"}, {"SubFeatureId": "PROD_FEAT_14985", "SubFeatureName": "Tatlandırıcı", "SubFeatureValue": "Hayır"}]}, {"FeatureId": "FET_GRP_1179_1220", "FeatureName": "Food consumption data", "SubFeatureItem": {"SubFeatureId": "PROD_FEAT_18008", "SubFeatureName": "Üretim Yeri", "SubFeatureValue": "Türkiye"}}], "MPG": "0", "PG": "698", "ProductName": "PREMIUM KAPSUL KAHVE 7 ITALY NESPRESSO UYUMLU", "SalesPrice": "", "id": "1220601"},{"article": "1221415", "ean": "8018080433634", "masterDataName": "iPhone Magsafe Kablosuz Şarj Standı + 20W Duvar Şarjı", "customerFriendlyName": "CELLULARLINE iPhone Magsafe Kablosuz Şarj Standı + 20W Duvar Şarjı", "productBrand": "CELLULARLINE", "primaryImage": "ASSET_MMS_93579231", "imageList": "ASSET_MMS_93579231,ASSET_MMS_93579234,ASSET_MMS_93579236", "url": "//www.mediamarkt.com.tr/tr/product/_cellularline-iphone-magsafe-kablosuz-şarj-standı-20w-duvar-şarjı-1221415.html", "availabilityLeadTime": "<li>Stoktan Gönderi <span class=\"icon icon-info\" data-layer=\"StoktanGonderi\"></span></li>", "categoryId": "465614", "catEntryId": "7935049", "productCategory": "Telefon > Telefon Aksesuarları > Şarj Cihazları", "salesPrice": "569.0", "shippingPrice": "19.9", "stock": "in_stock", "Barcode": "8018080433634", "DescriptionLong": "", "DescriptionShort": "iPhone Magsafe Kablosuz Şarj Standı + 20W Duvar Şarjı fiyatı ve özelliklerini incelemek için hemen tıkla, sen de kazananlar kulübüne katıl. Kazananlar MediaMarkt'ta!", "FeatureItem": {"FeatureId": "FET_GRP_1422_0410", "FeatureName": "Ekipman", "SubFeatureItem": [{"SubFeatureId": "PROD_FEAT_16111", "SubFeatureName": "Yükseklik", "SubFeatureValue": "18"}, {"SubFeatureId": "PROD_FEAT_10134", "SubFeatureName": "Bağlantılar", "SubFeatureValue": "Usb-C"}, {"SubFeatureId": "PROD_FEAT_15872", "SubFeatureName": "Uyumlu Marka", "SubFeatureValue": "Apple"}, {"SubFeatureId": "PROD_FEAT_15873", "SubFeatureName": "Uyumlu Model", "SubFeatureValue": "iPhone"}, {"SubFeatureId": "PROD_FEAT_15516", "SubFeatureName": "Ambalaj Boyutu", "SubFeatureValue": "9 cm / 18 cm / 3 cm"}, {"SubFeatureId": "PROD_FEAT_16333", "SubFeatureName": "Ağırlık", "SubFeatureValue": "133"}, {"SubFeatureId": "PROD_FEAT_11470", "SubFeatureName": "Kutu İçeriği", "SubFeatureValue": "Magsafe Şarj Standı, 20W Şarj Adaptörü"}, {"SubFeatureId": "PROD_FEAT_10812", "SubFeatureName": "Renk (Üreticiye Göre)", "SubFeatureValue": "Beyaz"}, {"SubFeatureId": "PROD_FEAT_18008", "SubFeatureName": "Üretim Yeri", "SubFeatureValue": "Çin"}, {"SubFeatureId": "PROD_FEAT_10990", "SubFeatureName": "Ürün Tipi", "SubFeatureValue": "Kablosuz Şarj Cihazı"}, {"SubFeatureId": "PROD_FEAT_11330", "SubFeatureName": "Kapasite", "SubFeatureValue": "20W"}, {"SubFeatureId": "PROD_FEAT_14700", "SubFeatureName": "Ambalaj Genişliği", "SubFeatureValue": "9"}, {"SubFeatureId": "PROD_FEAT_14701", "SubFeatureName": "Ambalaj Yüksekliği", "SubFeatureValue": "18"}, {"SubFeatureId": "PROD_FEAT_16208", "SubFeatureName": "Üretici Garantisi", "SubFeatureValue": "2 Yıl Resmi Üretici Garantili"}, {"SubFeatureId": "PROD_FEAT_14702", "SubFeatureName": "Ambalaj Derinliği", "SubFeatureValue": "3"}, {"SubFeatureId": "PROD_FEAT_16112", "SubFeatureName": "Derinlik", "SubFeatureValue": "3"}, {"SubFeatureId": "PROD_FEAT_14703", "SubFeatureName": "Çevre Ölçüsü", "SubFeatureValue": "42 cm"}, {"SubFeatureId": "PROD_FEAT_16110", "SubFeatureName": "Genişlik", "SubFeatureValue": "9"}]}, "MPG": "0", "PG": "3955", "ProductName": "IPHONE MAGSAFE KABLOSUZ SARJ STANDI + 20W DUVAR S", "SalesPrice": "", "id": "1221415"}]`
  );
});

app.get("/data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://mirror.crwizard.com/mediamarkt/mediamarkt_features_feed.json"
    );
    // const response = await axios.get(
    //   "http://localhost:5000/filter"
    // );
    let apiResponse;
    let modifiedJsonString = response.data.replace(/,(?=\s*\])/, "");
    apiResponse = JSON.parse(modifiedJsonString);
    let array = [];
    array.push(apiResponse[0]);
    array.push(apiResponse[1]);
    array.push(apiResponse[2]);
    try {
      const question = "Bana bir şarj cihazı öner. Ürün url'inide paylaş. "; // Kullanıcının sorduğu soruyu al

      // PDF içeriğini parçalara ayır (örneğin, her bir paragrafı ayrı bir eleman olarak)

      let mostSimilarPart = "";
      let highestSimilarity = 0;

      for (const part of apiResponse) {
        const { data: partEmbeddings } = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          // input: part.toString(),
          input: JSON.stringify(processData(part)),
        });
        const { data: questionEmbeddings } = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: question,
        });

        const similarity = cosineSimilarity(
          partEmbeddings.data[0].embedding,
          questionEmbeddings.data[0].embedding
        );

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarPart = part;
        }
      }
      if (highestSimilarity > 0.8) {
        console.log(mostSimilarPart);
        // GPT modelini kullanarak soruya cevap ara
        const systemMessage = {
          //  Explain things like you're talking to a software professional with 5 years of experience.
          role: "system",
          content:
            "Kullanıcı bu şekilde bir soru sordu:" +
            question +
            "Bu soruya bir Media Markt danışmanı olarak cevap vermelisin. Cevap verirken birazdan paylaşacağım bilgiler dışında bir cevap vermemelisin.Bilgiler bunlar:" +
            JSON.stringify(processData(mostSimilarPart)) +
            "\n\n",
        };
        const gptResponse = await openai.createChatCompletion({
          model: "gpt-4-1106-preview",
          // prompt: mostSimilarPart + "\n\n" + question,
          messages: [
            systemMessage, // The system message DEFINES the logic of our chatGPT
          ],
          max_tokens: 500,
          temperature: 0.5,
          frequency_penalty: 0.5,
        });
        // const answer = gptResponse.data.choices[0].text.trim();
        const answer = gptResponse.data.choices[0].message.content;
        res.json({ answer });
      } else {
        res.json({ answer: "Soru ile ilgili bilgi bulunamadı." });
      }
    } catch (error) {
      console.error("Arama hatası", error);
      res.status(500).send(error);
    }
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    res.status(500).send("Veri çekilemedi");
  }
});

app.post("/search", upload.single("file"), async (req, res) => {
  try {
    const question =
      "İphone 13 128 gb ile İphone 11 128 gb arasındaki işlemci farkı nedir ve bu fark nasıl bir sonuç ortaya çıkartır? "; // Kullanıcının sorduğu soruyu al
    const pdfText = await processPDF(req.file.path);

    // PDF içeriğini parçalara ayır (örneğin, her bir paragrafı ayrı bir eleman olarak)
    const pdfParts = pdfText.split("\n\n");

    let mostSimilarPart = "";
    let highestSimilarity = 0;

    for (const part of pdfParts) {
      const { data: partEmbeddings } = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: part,
      });

      const { data: questionEmbeddings } = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: question,
      });

      const similarity = cosineSimilarity(
        partEmbeddings.data[0].embedding,
        questionEmbeddings.data[0].embedding
      );

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarPart = part;
      }
    }
    if (highestSimilarity > 0.8) {
      // GPT modelini kullanarak soruya cevap ara
      const systemMessage = {
        //  Explain things like you're talking to a software professional with 5 years of experience.
        role: "system",
        content: mostSimilarPart + "\n\n" + question,
      };
      const gptResponse = await openai.createChatCompletion({
        model: "gpt-4-1106-preview",
        // prompt: mostSimilarPart + "\n\n" + question,
        messages: [
          systemMessage, // The system message DEFINES the logic of our chatGPT
        ],
        max_tokens: 500,
        temperature: 0.5,
        frequency_penalty: 0.5,
      });
      // const answer = gptResponse.data.choices[0].text.trim();
      const answer = gptResponse.data.choices[0].message.content;
      console.log({ answer });
    } else {
      res.json({ answer: "Soru ile ilgili bilgi bulunamadı." });
    }
  } catch (error) {
    console.error("Arama hatası", error);
    res.status(500).send(error);
  }
});

function cosineSimilarity(vecA, vecB) {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotproduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  const similarity = dotproduct / (mA * mB);
  return similarity;
}

app.get("/asistan", async (req, res) => {
  const file = await openai.files.create({
    file: fs.createReadStream("data.jsonl"),
    purpose: "assistants",
  });
  // Add the file to the assistant
  const assistant = await openai.beta.assistants.create({
    instructions:
      "You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
    model: "gpt-4-1106-preview",
    tools: [{ type: "retrieval" }],
    file_ids: [file.id],
  });
  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "Bir önceki sorum neydi?",
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: "Media Markt çalışanı olarak cevap ver.",
  });
  const checkStatusAndPrintMessages = async (threadId, runId) => {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    console.log("burda");
    if (runStatus.status === "completed") {
      let messages = await openai.beta.threads.messages.list(threadId);
      messages.data.forEach((msg) => {
        const role = msg.role;
        const content = msg.content[0].text.value;
        console.log(content);
        res.json(content);
      });
    } else {
      checkStatusAndPrintMessages(thread.id, run.id);
    }
  };

  setTimeout(() => {
    checkStatusAndPrintMessages(thread.id, run.id);
  }, 15000);
});
app.get("/getfile", async (req, res) => {
  const file = await openai.files.create({
    file: fs.createReadStream("data.jsonl"),
    purpose: "assistants",
  });
  res.json(file);
});
app.get("/json", async (req, res) => {
  const fs = require("fs");
  // Yazılacak veri
  const obj = [{ name: "Ahmet", age: 30 },{ name: "Ahmet", age: 30 },{ name: "Ahmet", age: 30 }];
  // Veriyi JSONL formatına dönüştürme
  const jsonlString = JSON.stringify(obj);
  // Dosyaya yazma
  fs.appendFile("veri.jsonl", jsonlString, (err) => {
    if (err) {
      console.error("Dosyaya yazılırken bir hata oluştu:", err);
    } else {
      console.log("Veri başarıyla kaydedildi.");
    }
  });
  });
app.listen(5000, () => {
  console.log("Sunucu port 5000'de çalışıyor");
});

// app.get("/fetch-csv", async (req, res) => {
//   let array = [];
//   try {
//     const { data } = await axios.get(
//       "https://mirror.crwizard.com/mediamarkt/mediamarkt_features_feed.json",
//       {
//         responseType: "stream",
//       }
//     );

//     data
//       .pipe(csvParser())
//       .on("data", (row) => {
//         array.push(row);
//       })
//       .on("end", async () => {
//         try {
//           console.log(array.length);
//         } catch (error) {
//           console.error("Arama hatası", error);
//           res.status(500).send(error);
//         }
//       });
//     data.pipe(res);
//     // data.pipe(process.stdout);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching CSV" });
//   }
// });
