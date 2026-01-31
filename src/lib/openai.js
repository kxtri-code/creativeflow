
// User provided fallback key (removed for security - use Settings > AI Settings)
const FALLBACK_KEY = null;

let openAIKey = null;

export const initializeOpenAI = (apiKey) => {
  if (!apiKey) {
    console.error("Initialize OpenAI called with empty API Key");
    return;
  }
  openAIKey = apiKey;
  console.log("OpenAI API initialized successfully");
};

const getApiKey = () => {
  if (openAIKey) return openAIKey;
  
  // 1. Check environment variable
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey) return envKey;
  
  // 2. Check localStorage
  const localKey = localStorage.getItem('openai_api_key');
  if (localKey) return localKey;

  // 3. Use fallback
  console.log("Using fallback OpenAI key");
  return FALLBACK_KEY;
}

export const generateJSON = async (prompt, schema) => {
  const key = getApiKey();

  if (!key) {
    throw new Error("OpenAI API Key not found. Please configure it in Settings.");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast and cheap, good for JSON
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant. You must output valid JSON. 
            The JSON must strictly follow this schema structure: ${JSON.stringify(schema || {})}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);

  } catch (error) {
    console.error("OpenAI Generation Error:", error);
    throw error;
  }
};

export const generateText = async (prompt) => {
  const key = getApiKey();

  if (!key) {
    throw new Error("OpenAI API Key not found. Please configure it in Settings.");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("OpenAI Text Generation Error:", error);
    throw error;
  }
};
