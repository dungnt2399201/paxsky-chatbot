const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// API chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const ai = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Bạn là tư vấn Paxsky.
Văn phòng:
- Trương Định
- Ung Văn Khiêm
- Nguyễn Đình Chiểu
- Lê Lai
Hotline: 0911 07 22 99

Luôn trả lời ngắn gọn, hỏi nhu cầu và chốt lịch.`
          },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json({
      reply: ai.data.choices[0].message.content
    });
  } catch (err) {
    res.json({ reply: "Đang lỗi hệ thống, vui lòng thử lại!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server chạy"));