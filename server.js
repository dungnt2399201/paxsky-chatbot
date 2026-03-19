const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const SHEET_API = "https://opensheet.elk.sh/1xD_unpV8m2_OHHotuOp2-W0NwYDminj0pi6WmfmubEg/Sheet1";

async function getSheetData() {
  const res = await axios.get(SHEET_API);
  return res.data;
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    const sheetRes = await axios.get(SHEET_API);
    const sheetData = sheetRes.data;

    // 👉 LOG ĐÚNG CHỖ
    console.log("DATA:", sheetData);

    const found = sheetData.find(row => {
      if (!row.keyword) return false;

      const keywords = row.keyword
        .toLowerCase()
        .split(";")
        .map(k => k.trim());

      return keywords.some(k => userMessage.includes(k));
    });

    if (found) {
      return res.json({ reply: found.reply });
    }

    return res.json({
      reply: "Anh/chị vui lòng cho em thêm thông tin để hỗ trợ tốt hơn ạ!"
    });

  } catch (err) {
    console.log("ERROR:", err.message);
    res.json({ reply: "Lỗi hệ thống!" });
  }
});

app.listen(3000, () => console.log("Server chạy"));
console.log("DATA:", sheetData);
