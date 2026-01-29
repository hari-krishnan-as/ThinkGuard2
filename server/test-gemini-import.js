import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
  model: "gemini-pro"
});

    const result = await model.generateContent(
      "Reply only with: Gemini API is working"
    );

    console.log("✅ SUCCESS RESPONSE:");
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ FAILED");
    console.error(error.message);
  }
}

run();
