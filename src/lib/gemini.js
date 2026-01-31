import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

export const initializeGemini = (apiKey) => {
  if (!apiKey) {
    console.error("Initialize Gemini called with empty API Key");
    return;
  }
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("Gemini API initialized successfully");
  } catch (e) {
    console.error("Failed to initialize Gemini API", e);
  }
};

export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  if (!genAI) {
    // Auto-initialize if key is available in env
    let key = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (key) {
      key = key.trim(); // Sanitize key
      console.log(`Auto-initializing Gemini with env key (Length: ${key.length})`);
      initializeGemini(key);
    } else {
      console.error("VITE_GEMINI_API_KEY is missing from environment variables.");
    }
  }

  if (!genAI) {
    throw new Error("Gemini API not initialized. Please check VITE_GEMINI_API_KEY in Vercel environment variables.");
  }
  
  return genAI.getGenerativeModel({ model: modelName });
};

// Comprehensive fallback list covering all stable tiers
const MODELS_TO_TRY = [
  "gemini-1.5-flash", // Standard fast model
  "gemini-1.5-pro",   // Standard capable model
  "gemini-pro"        // Legacy stable model (1.0 Pro)
];

export const generateJSON = async (prompt, schema) => {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = getGeminiModel(modelName);
      
      // Attempt 1: Try with structured output schema (Best for reliability)
      // Only 1.5/2.0 models support responseSchema well in all versions
      if (modelName.includes("1.5") || modelName.includes("2.0")) {
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
          console.warn(`Schema generation failed for ${modelName}, falling back to simple JSON mode`, schemaError);
          // Continue to simple JSON mode below
        }
      }

      // Attempt 2: Simple JSON mode (Better compatibility / Fallback)
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return only valid JSON adhering to the requested structure. Do not include markdown formatting.`;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: jsonPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      let text = result.response.text();
      return cleanJsonText(text);

    } catch (error) {
      console.warn(`Model ${modelName} failed completely, trying next model...`, error);
      lastError = error;
      // Continue loop to try next model
    }
  }

  // If we get here, all models failed
  console.error("All Gemini models failed to generate content.");
  throw lastError || new Error("All Gemini models failed to generate content.");
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
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      return result.response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed for text generation`, error);
      lastError = error;
    }
  }
  throw lastError || new Error("All Gemini models failed to generate text.");
};
