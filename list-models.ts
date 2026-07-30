import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found");
    return;
  }
  
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    
    if (data.models) {
      console.log("Available models supporting generateContent:");
      data.models.filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
        .forEach((m: any) => console.log(`- ${m.name.replace('models/', '')}`));
    } else {
      console.log("Error fetching models:", data);
    }
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();
