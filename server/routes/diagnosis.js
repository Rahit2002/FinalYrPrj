const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/diagnosis — symptom checker
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { symptoms } = req.body;

    // Validation
    if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length < 5) {
      return res.status(400).json({
        error: "Please describe your symptoms properly",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a medical assistant for the Seva health platform.

A patient has described their symptoms.

Patient symptoms:
"${symptoms}"

Provide a helpful response in STRICT JSON format.

Rules:
- Return ONLY valid JSON
- No markdown
- No explanation text
- No backticks

JSON format:
{
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "severity": "mild",
  "recommendedSpeciality": "Doctor speciality",
  "immediateSteps": ["step1", "step2", "step3"],
  "seekEmergencyCare": false,
  "disclaimer": "Always consult a qualified doctor for proper diagnosis."
}
`;

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    // Safer extraction
    const raw = response.response.text().trim();

    let result;

    try {
      // Remove markdown if Gemini still returns it
      const clean = raw.replace(/```json|```/g, "").trim();

      result = JSON.parse(clean);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      return res.status(500).json({
        error: "AI returned invalid response",
      });
    }

    // Save diagnosis history
    await pool.query(
      `
      INSERT INTO diagnosis_history 
      (user_id, symptoms, result) 
      VALUES ($1, $2, $3)
      `,
      [req.user.id, symptoms.trim(), JSON.stringify(result)]
    );

    return res.json(result);
  } catch (err) {
    console.error("Diagnosis API Error:", err);

    return res.status(500).json({
      error: "Diagnosis service error",
    });
  }
});

// GET /api/diagnosis/history — past diagnoses
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, symptoms, result, created_at
      FROM diagnosis_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
      `,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("History Fetch Error:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;