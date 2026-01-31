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
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

// Mock data generator for Demo Mode when API fails
const getMockResponseForPrompt = (prompt) => {
  const p = prompt.toLowerCase();
  
  // Magic Editor Mock
  if (p.includes("refine") || p.includes("improve") || p.includes("grammar")) {
    return JSON.stringify({
      refinedText: "This is a simulated refinement. The AI service is currently unavailable (API Key/Quota Issue), so this mock text is provided to demonstrate the UI functionality. Your content has been polished for clarity and flow.",
      improvements: ["Fixed grammar (Simulated)", "Improved sentence structure (Simulated)", "Optimized tone (Simulated)"]
    });
  }
  
  // Captionist Mock
  if (p.includes("caption") || p.includes("hashtag") || p.includes("social")) {
    return JSON.stringify({
      caption: "🚀 Excited to share this update! (Simulated Caption - AI Service Unavailable)",
      hashtags: ["#simulated", "#demo", "#creativeflow", "#innovation"],
      bestTime: "Tomorrow at 10:00 AM"
    });
  }
  
  // Brand Guardian Mock
  if (p.includes("compliant") || p.includes("brand") || p.includes("guidelines")) {
    return JSON.stringify({
      isCompliant: true,
      issues: [],
      suggestions: ["Everything looks good! (Simulated Check)"]
    });
  }
  
  // Editorial/Content Mock
  if (p.includes("topic") || p.includes("article") || p.includes("blog")) {
    return JSON.stringify({
      topics: [
        { title: "The Future of AI (Simulated)", type: "Article" },
        { title: "Remote Work Trends (Simulated)", type: "Blog Post" },
        { title: "Sustainable Design (Simulated)", type: "Case Study" }
      ]
    });
  }

  // Default generic JSON
  return JSON.stringify({
    result: "Simulated response",
    status: "AI_UNAVAILABLE",
    message: "Please check your API Key configuration."
  });
};

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

  // If we get here, all models failed.
  console.error("All Gemini models failed.");
  if (lastError) throw lastError;
  throw new Error("Failed to connect to any Gemini model.");
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
  
  console.error("All Gemini models failed for text generation.");
  if (lastError) throw lastError;
  throw new Error("Failed to generate text.");
};
