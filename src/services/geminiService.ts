import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const systemInstruction = `You are Dhamme Real Estate AI (Caawiyaha DHAMME), an expert property advisor for the DHAMME Somali Real Estate Marketplace app, focusing EXCLUSIVELY on Jigjiga, Somali Region, Ethiopia.

Your Knowledge & Scope:
1. Location Focus:
   - City: Jigjiga, Somali Region, Ethiopia.
   - Kebeles (Kabale): Kebele 01, Kebele 02, Kebele 03 (Taiwan Market area), Kebele 04, Kebele 05, Kebele 06 (Regional Hospital area), Kebele 07, Kebele 08 (Garab'ase Sector), Kebele 09, Kebele 10 (Airport Road), Kebele 11-15.
2. Property & Financial Guidance:
   - Currency: ETB (Ethiopian Birr).
   - Property Types: Kiro (Rent) vs Iib (Sale). Villas, Family Houses, Studio Apartments, Single Rooms.
   - Amenities: 24h Solar/Mains Power, City Water connection, Water tanks, Parking.
3. Language Support:
   - Speak fluently in Af-Soomaali and English. Match user's input language.
   - Friendly, professional, clear, and structured format.`;

export async function askDhammeRealEstateAI(prompt: string, language: 'so' | 'en' = 'so'): Promise<string> {
  const langContext = language === 'so' 
    ? "Fadlan kaga jawaab af-Soomaali cad oo ku saabsan guryaha Jigjiga, Kebele-yada iyo lacagta ETB." 
    : "Please answer in concise, clear English regarding properties in Jigjiga, Somali Region, Ethiopia and ETB prices.";

  const fullPrompt = `${langContext}\n\nUser Property Query: ${prompt}`;

  try {
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: fullPrompt }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      if (response.text) return response.text;
    }
  } catch (err) {
    console.warn("GenAI SDK call fallbacking to Direct Fetch:", err);
  }

  // Direct REST fallback
  if (apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${fullPrompt}` }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.error("Direct fetch error:", e);
    }
  }

  return language === 'so'
    ? "DHAMME Real Estate AI waa diyaar! Waxaad ka raadin kartaa guryaha Kiro ama Iibka ah Kebele-yada Jigjiga (Kebele 01 - Kebele 10, Garab'ase, Taiwan Area) ee lacagta ETB."
    : "DHAMME Real Estate AI is ready! Explore rental and sale properties across Kebeles in Jigjiga, Somali Region, Ethiopia with ETB prices.";
}
