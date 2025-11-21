import dotenv from "dotenv";
import SearchQueue from "../models/searchQueue.model.js";
import OpenAI from "openai";
import Replicate from "replicate";
import {jsonrepair} from "jsonrepair";

dotenv.config();

// ✅ Clients
const groqAI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const SDXL_VERSION = "stability-ai/sdxl";

// 🌄 Generate image from text
async function generateImageFromPrompt(prompt) {
  const SDXL_VERSION = "stability-ai/sdxl";

  // Convert filenames or URLs to useful prompts
  if (!prompt.match(/[a-zA-Z]{3,}/)) {
    prompt = "YouTube thumbnail of concept art";
  } else if (prompt.includes("http") || /\.(jpg|jpeg|png)$/i.test(prompt)) {
    prompt = prompt
      .split("/").pop()
      .replace(/[-_]/g, " ")
      .replace(/\.[a-z]+$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const finalPrompt = `YouTube thumbnail: ${prompt}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const output = await replicate.run(SDXL_VERSION, {
        input: {
          prompt: finalPrompt,
          width: 1024,
          height: 576,
        },
      });

      if (Array.isArray(output) && output[0]) {
        console.log("✅ Image generated successfully");
        return output[0];
      }

      console.warn("⚠️ Replicate returned empty output.");
      break;
    } catch (err) {
      const retryAfter = err?.response?.data?.retry_after || 3 * (attempt + 1);
      console.warn(`⏳ Image attempt ${attempt + 1} failed: ${err?.message}`);
      console.log(`🕒 Waiting ${retryAfter} seconds before retry...`);
      await new Promise((res) => setTimeout(res, retryAfter * 1000));

      if (attempt === 2) {
        console.error("🚫 All attempts failed. Using fallback.");
      }
    }
  }

  return "https://via.placeholder.com/1024x576.png?text=Image+Unavailable";
};

export const getTrendingTopics = async (req, res) => {
  try {
    const topics = await SearchQueue.find().sort({ searchedAt: -1 }).limit(10);
    res.json(topics.map((item) => item.query));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch topics" });
  }
};

// 📌 Main route: AI + thumbnails
// 📌 AI + Thumbnail Generation Route
export const generateIdeas = async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ message: "Topic is required" });

  console.log("🧠 Generating ideas for:", topic);

  try {
    const prompt = `Give 3 YouTube video ideas on "${topic}" with: title, script, tags, description, and thumbnail (text prompt). Return valid JSON only in this format:

{
  "titles": ["", "", ""],
  "scripts": ["", "", ""],
  "tags": ["", "", ""],
  "descriptions": ["", "", ""],
  "thumbnails": ["", "", ""]
}`;

    const completion = await groqAI.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rawText = completion.choices[0].message.content;

    // ✅ Extract JSON only (avoid prefix like "Here is the JSON:")
    const jsonBlock = rawText.match(/{[\s\S]+}/)?.[0];

    if (!jsonBlock) {
      console.error("❌ No valid JSON block found:", rawText);
      return res.status(500).json({ message: "Groq returned invalid format", raw: rawText });
    }

    // 🛠️ Clean and parse it
    let parsed;
    try {
      const repaired = jsonrepair(jsonBlock);
      parsed = JSON.parse(repaired);
    } catch (err) {
      console.error("❌ JSON Parse Error:", jsonBlock);
      return res.status(500).json({ message: "Invalid JSON", raw: jsonBlock });
    }

    // 🌄 Convert thumbnail prompts to image URLs
    parsed.thumbnails = await Promise.all(parsed.thumbnails.map(generateImageFromPrompt));

    res.json(parsed);
  } catch (err) {
    console.error("🔥 Error generating ideas:", err.message);
    res.status(500).json({ message: "AI generation failed", error: err.message });
  }
};
