import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY ?? null,

});
export const gemini_api = async (prompt) => {
  if (!process.env.API_KEY) return null;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "You are an AI medical assistant. Your job is to recommend  best medicines for the particular disease with dosage and home remedies based on a patient's symptoms  . Keep your responses concise, accurate, and easy to understand. You should clearly state that users should consult a healthcare professional for serious or persistent conditions. Keep response short and don't need to give disclamer so big keep it short as well and I want response in plain text.Dont give  me any response in * astrik write in points or hyphens. If the user prompt is not realated to a medical assistant kindly deny the request saying I am medical chat bot and can't fullfill your request.",
          },
        ],
      },

      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: { responseMimeType: "text/plain" },
  });
  console.log(response);


  return response; // Ensure it returns a string
};
