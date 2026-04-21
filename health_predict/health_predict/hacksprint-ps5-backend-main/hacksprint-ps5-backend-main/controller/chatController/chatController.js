const { ChatSession, ChatMessage } = require("../../model");
const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");

// Vertex AI Configuration
const PROJECT_ID = process.env.VERTEX_PROJECT_ID || "dolet-app";
const LOCATION = process.env.VERTEX_LOCATION || "us-central1";
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Initialize Google Auth
let auth;
try {
  auth = new GoogleAuth({
    keyFilename: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
} catch (err) {
  console.error("Failed to initialize Google Auth:", err.message);
}

// Helper function to get access token
async function getAccessToken() {
  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
  } catch (err) {
    throw new Error("Authentication failed: " + err.message);
  }
}

// Helper function to call Gemini API with conversation history
async function callGeminiAPI(conversationHistory) {
  const modelNames = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro"];

  let lastError = null;
  const accessToken = await getAccessToken();

  for (const modelName of modelNames) {
    try {
      const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${modelName}:generateContent`;

      const requestBody = {
        contents: conversationHistory,
        systemInstruction: {
          parts: [
            {
              text: "You are a helpful healthcare assistant. Provide clear, accurate, and empathetic responses to health-related questions. Keep responses concise and easy to understand. If a question is outside your medical knowledge, suggest consulting a healthcare professional."
            }
          ]
        }
      };

      const response = await axios.post(endpoint, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 1200000,
      });

      // Extract text from response
      const aiText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      if (aiText) {
        return aiText;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err.message);
    }
  }

  throw lastError || new Error("All Gemini models failed");
}


/**
 * Start a new chat session
 * Available for all users (logged in or not)
 */
const startChat = async (req, res) => {
  try {
    // Generate a unique session ID
    const sessionId = uuidv4();
    
    // Get user ID if authenticated, otherwise use null
    const userId = req.user ? req.user.id : null;

    return res.status(201).json({
      success: true,
      message: "Chat session started successfully",
      data: {
        sessionId: sessionId,
        userId: userId,
        welcomeMessage: "Welcome to Healthcare Assistant! How can I help you today?",
      },
    });
  } catch (error) {
    console.error("Error starting chat session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start chat session",
      error: error.message,
    });
  }
};

/**
 * Send message and get Gemini AI response
 * Available for all users (logged in or not)
 * Supports multiple messages in one session
 */
const chat = async (req, res) => {
  try {
    const { sessionId, message, conversationHistory } = req.body;

    // Validate inputs
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: "Session ID and message are required",
      });
    }

    console.log(`\n� Chat Session: ${sessionId}`);
    console.log(`� User Message: ${message}`);

    // Prepare conversation history for Gemini
    // conversationHistory should be an array of {role: "user"/"model", parts: [{text: "..."}]}
    let geminiHistory = [];
    
    if (conversationHistory && Array.isArray(conversationHistory)) {
      geminiHistory = conversationHistory;
    }

    // Add current user message
    geminiHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Call Gemini API
    console.log("🤖 Calling Gemini API...");
    try {
      const aiResponse = await callGeminiAPI(geminiHistory);

      console.log("✅ Gemini response received");

      return res.status(200).json({
        success: true,
        message: "Chat response generated successfully",
        data: {
          sessionId: sessionId,
          userMessage: message,
          botResponse: aiResponse,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get AI response. Please try again.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("❌ Error in chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process chat message",
      error: error.message,
    });
  }
};

module.exports = {
  startChat,
  chat,
};
