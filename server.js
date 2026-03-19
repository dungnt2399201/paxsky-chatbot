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

    let sheetData = [];

    try {
      const sheetRes = await axios.get(SHEET_API);
      sheetData = sheetRes.data;
    } catch (e) {
      console.log("Sheet lỗi:", e.message);
    }

    // tìm keyword
    const found = sheetData.find(row =>
      userMessage.includes(row.keyword)
    );

    if (found) {
      return res.json({ reply: found.reply });
    }

    return res.json({
      reply: "Anh/chị vui lòng cho em thêm thông tin để hỗ trợ tốt hơn ạ!"
    });

  } catch (err) {
    console.log("MAIN ERROR:", err.message);
    res.json({ reply: "Lỗi hệ thống!" });
  }
});

app.listen(3000, () => console.log("Server chạy"));
console.log("DATA:", sheetData);
