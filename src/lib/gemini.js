import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback key to ensure reliability
const FALLBACK_KEY = 'AIzaSyDZM-aBy-SuR1E6_cj2IrqFhRLVdVUpy90';

let genAI = null;

export const initializeGemini = (apiKey) => {
  if (!apiKey) return;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("Gemini API initialized successfully");
  } catch (e) {
    console.error("Failed to initialize Gemini API", e);
  }
};

export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  if (!genAI) {
    // Auto-initialize if key is available in env or fallback
    const key = import.meta.env.VITE_GEMINI_API_KEY || FALLBACK_KEY;
    if (key) {
      console.log("Auto-initializing Gemini with fallback/env key");
      initializeGemini(key);
    }
  }

  if (!genAI) {
    throw new Error("Gemini API not initialized. Please provide an API key.");
  }
  
  // Use the standard stable model (Gemini 1.5 Flash)
  try {
    return genAI.getGenerativeModel({ model: modelName });
  } catch (error) {
    console.warn(`Model ${modelName} failed, falling back to gemini-pro`);
    return genAI.getGenerativeModel({ model: "gemini-pro" });
  }
};

export const generateJSON = async (prompt, schema) => {
  let model = getGeminiModel();
  
  try {
    // Attempt 1: Try with structured output schema (Best for reliability)
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      let text = result.response.text();
      return cleanJsonText(text);
    } catch (schemaError) {
       // If schema generation fails (e.g. model doesn't support it), fall back to text
       console.warn("Schema generation failed, trying simple JSON mode", schemaError);
       throw schemaError; 
    }

  } catch (error) {
    console.warn("Gemini structured output failed, retrying with simple JSON mode...", error);
    
    try {
      // Attempt 2: Fallback to simple JSON mode (Better compatibility)
      // Append instruction to ensure JSON
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return only valid JSON adhering to the requested structure. Do not include markdown formatting.`;
      
      // Re-get model in case the previous one was the issue (though unlikely for same instance)
      // Ensure we are using a model that might work better for text if schema failed
      model = getGeminiModel("gemini-pro"); 

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: jsonPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      let text = result.response.text();
      return cleanJsonText(text);
      
    } catch (retryError) {
      console.error("Gemini JSON generation failed completely:", retryError);
      throw retryError;
    }
  }
};

const cleanJsonText = (text) => {
  if (!text) return "{}";
  // Clean up markdown code blocks if present
  let cleaned = text;
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
};

export const generateText = async (prompt) => {
  const model = getGeminiModel();
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text();
};
