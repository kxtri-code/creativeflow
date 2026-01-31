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
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (key) {
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

// Removed gemini-pro as it's deprecated/unavailable in v1beta for free tier in some regions
// gemini-1.5-flash is the current standard for speed and cost
const MODELS_TO_TRY = ["gemini-1.5-flash", "gemini-1.5-flash-001"];

export const generateJSON = async (prompt, schema) => {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = getGeminiModel(modelName);
      
      // Attempt 1: Try with structured output schema (Best for reliability)
      // Only 1.5 models support responseSchema well in all versions
      if (modelName.includes("1.5")) {
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
  const model = getGeminiModel();
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text();
};
