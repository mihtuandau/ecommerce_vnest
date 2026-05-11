import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from servers directory (2 levels up from src/chatbot)
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Không tìm thấy GEMINI_API_KEY trong file .env tại: " + path.join(__dirname, "../../.env"));
    return;
  }

  try {
    console.log("🔍 Đang truy vấn danh sách Model khả dụng...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ Lỗi API:", data.error.message);
        return;
    }

    console.log("\n--- CÁC MODEL KHẢ DỤNG CHO KEY CỦA BẠN ---");
    data.models?.forEach((m: any) => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name} (${m.displayName})`);
      }
    });
  } catch (error) {
    console.error("❌ Lỗi kết nối:", error.message);
  }
}

listModels();
