const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini (Will crash if API key is missing, we will handle this)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/analyze', async (req, res) => {
  const body = req.body || {};
  const reviews = body.reviews;

  if (!reviews) {
    return res.status(400).json({ error: 'Please provide some reviews to analyze.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY in .env file.' });
  }

  try {
    let userId = null;
    let supabase = null;

    // 1. Verify User & Enforce Rate Limiting (5 requests per user)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      const { createClient } = require('@supabase/supabase-js');
      supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (user) {
          userId = user.id;
          
          // Check how many reports this user has generated
          const { count } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
            
          if (count >= 5) {
            return res.status(429).json({ 
              error: 'Rate limit reached! You have used all 5 of your free AI reports.' 
            });
          }
        }
      }
    }

    // 2. Choose the model (Using the latest available flash model)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 2. Prompt Engineering: Tell the AI exactly how to behave and format its output
    const prompt = `
      You are an expert customer feedback analyzer. 
      Analyze the following customer reviews and return a structured JSON response.
      
      Here are the reviews:
      """
      ${reviews}
      """

      You MUST respond with ONLY a raw JSON object. Do not use markdown blocks like \`\`\`json.
      The JSON must exactly match this structure:
      {
        "overall_sentiment": "Positive", // Or "Negative", "Neutral", "Mixed"
        "sentiment_score": 85, // A number from 0 to 100
        "top_complaints": ["complaint 1", "complaint 2"], // Array of short strings, max 3
        "top_praises": ["praise 1", "praise 2"], // Array of short strings, max 3
        "themes": ["theme 1", "theme 2", "theme 3"], // Array of 1-2 word strings, max 5
        "summary": "A 2-3 sentence summary of all the feedback."
      }
    `;

    // 3. Make the API Call to Gemini
    const result = await model.generateContent(prompt);
    let aiText = result.response.text();

    // 4. JSON Parsing & Cleanup
    // Sometimes the AI wraps JSON in ```json ... ``` blocks despite our instructions.
    // We clean it up just in case to prevent JSON.parse from failing.
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Convert the text string into a real JavaScript object
    const aiData = JSON.parse(aiText);

    // 5. Save to Supabase (Database)
    if (supabase && userId) {
      try {
        const { error: dbError } = await supabase
          .from('reports')
          .insert([
            { 
              user_id: userId,
              reviews_text: reviews,
              overall_sentiment: aiData.overall_sentiment,
              sentiment_score: aiData.sentiment_score,
              summary: aiData.summary,
              themes: aiData.themes,
              top_praises: aiData.top_praises,
              top_complaints: aiData.top_complaints
            }
          ]);
          
        if (dbError) {
          console.error("Supabase Insert Error:", dbError);
        } else {
          console.log(`Successfully saved report to Supabase for user: ${userId}`);
        }
      } catch (dbErr) {
        console.error("Database connection failed:", dbErr);
      }
    } else {
      console.log("Skipping database save: Not logged in or SUPABASE config missing.");
    }

    // 6. Send back to frontend!
    res.json(aiData);

  } catch (error) {
    console.error("AI Error:", error);
    // Malformed JSON or API failure handling
    res.status(500).json({ 
      error: 'Failed to analyze reviews with AI.', 
      details: error.message 
    });
  }
});

module.exports = router;
