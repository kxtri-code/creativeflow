import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

// User provided fallback key (added via support request)
const FALLBACK_KEY = "AIzaSyA2GnTD4eRqcQRNC54N0iPFm6nLb924xn0";

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
    // 1. Try environment variable
    let key = import.meta.env.VITE_GEMINI_API_KEY;
    
    // 2. Try localStorage (if user set it manually in previous session)
    if (!key) {
      key = localStorage.getItem('gemini_api_key');
    }

    // 3. Use provided fallback key
    if (!key) {
      console.log("Using provided fallback API key");
      key = FALLBACK_KEY;
    }
    
    if (key) {
      key = key.trim();
      initializeGemini(key);
    } else {
      console.error("VITE_GEMINI_API_KEY is missing from environment variables and no fallback found.");
    }
  }

  if (!genAI) {
    throw new Error("Gemini API not initialized. Please check VITE_GEMINI_API_KEY in Vercel environment variables.");
  }
  
  return genAI.getGenerativeModel({ model: modelName });
};

// Comprehensive fallback list covering all stable tiers
const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

export const generateJSON = async (prompt, schema) => {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = getGeminiModel(modelName);

      const generationConfig = {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        responseMimeType: "application/json",
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();
      
      console.log(`Successfully generated content with ${modelName}`);
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("JSON Parse Error:", e);
        // Try to extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
        throw new Error("Failed to parse JSON response");
      }

    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      
      // If error is 404 (Model not found), continue to next model
      if (error.message.includes("404") || error.message.includes("not found")) {
        continue;
      }
      
      // If it's a permission/quota error, we might want to stop or try next
      // For now, we try next model in case it's a specific model outage
    }
  }

  // If we get here, all models failed
  console.error("All Gemini models failed. Last error:", lastError);
  throw lastError || new Error("All AI models failed to respond");
};

export const generateText = async (prompt) => {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      if (error.message.includes("404") || error.message.includes("not found")) continue;
    }
  }
  
  throw lastError || new Error("All AI models failed to respond");
};
