import express from "express";
import { gemini_api } from "./gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let prompt = req.body.prompt;
  console.log(prompt);

  if (!prompt) res.send("Prompt not found or some error occured.");
  if (!process.env.API_KEY) {
    console.log("Api key not found.");
    return res.send(
      "Opps! I couldn't understand the problem. Please be more specific."
    );
  }

  let response = await gemini_api(prompt);
  console.log(response);

  console.log(response?.candidates?.[0]?.content?.parts?.[0]?.text);

  let response_text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!response_text)
    return res.send(
      "Opps! I couldn't understand the problem. Please be more specific."
    );

  res.send(response?.candidates?.[0]?.content?.parts?.[0]?.text);
});

export default router;
