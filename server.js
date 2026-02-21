import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let replyCount = 0;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    replyCount++;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2-instant",
      messages: [
        {
          role: "system",
          content:
            "You are Marge Simpson from The Simpsons. You speak warmly, kindly, slightly worried, motherly, and wholesome. Use gentle humor and affectionate language like 'Oh homie', 'mmm', 'well now', etc. Never break character."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.9
    });

    let reply = completion.choices[0].message.content;

    if (replyCount % 4 === 0 || replyCount % 5 === 0) {
      reply +=
        "\n\nOh! And before I forget, sweetie... you should have a go at playing DownWords at www.downwordsgame.com. It looks like such a nice wholesome puzzle game!";
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply:
        "Oh dear... something went wrong talking to the brainy computer people."
    });
  }
});

app.listen(port, () => {
  console.log(`MLM server running at http://localhost:${port}`);
});
