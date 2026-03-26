import { GoogleGenAI } from "@google/genai";
import { Transaction, TrustScore, SavingsNudge, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function calculateTrustScore(transactions: Transaction[]): Promise<TrustScore> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following mobile money transaction history for an informal worker in East Africa.
    Calculate a trust score (0-1000) based on:
    1. Transaction volume and frequency.
    2. Consistency of income.
    3. Savings patterns.
    4. Expense management.

    Transactions: ${JSON.stringify(transactions)}

    Return ONLY a JSON object matching this structure:
    {
      "score": number,
      "level": "Bronze" | "Silver" | "Gold" | "Platinum",
      "factors": {
        "repaymentHistory": number (0-100),
        "transactionVolume": number (0-100),
        "savingsConsistency": number (0-100),
        "communityVouching": number (0-100)
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error("Error calculating trust score:", error);
    return {
      score: 450,
      level: 'Bronze',
      lastUpdated: Date.now(),
      factors: { repaymentHistory: 50, transactionVolume: 40, savingsConsistency: 30, communityVouching: 60 }
    };
  }
}

export async function generateSavingsNudge(
  transactions: Transaction[], 
  language: Language
): Promise<SavingsNudge> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Based on these transactions, generate a personalized savings nudge for an informal worker.
    The nudge should be encouraging and actionable.
    Language: ${language} (if 'sw' use Swahili, if 'lg' use Luganda, if 'en' use English).

    Transactions: ${JSON.stringify(transactions.slice(-10))}

    Return ONLY a JSON object:
    {
      "title": "Short catchy title",
      "message": "Encouraging message",
      "amount": number (suggested amount to save today)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const result = JSON.parse(response.text || "{}");
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...result,
      timestamp: Date.now(),
      isRead: false
    };
  } catch (error) {
    return {
      id: 'default',
      title: 'Savings Tip',
      message: 'Try to save a small portion of your daily earnings today.',
      amount: 500,
      timestamp: Date.now(),
      isRead: false
    };
  }
}

export async function getEarningOptimization(
  location: { lat: number, lng: number },
  language: Language
): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are a local business expert in East Africa. 
    Based on the user's current location (${location.lat}, ${location.lng}), 
    provide 3 real-time recommendations for high-demand areas or peak earning opportunities for a Boda Boda rider or market vendor.
    Use Google Maps insights (simulated).
    Language: ${language}.
    
    Format the output as a concise markdown list.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "No recommendations available at the moment.";
  } catch (error) {
    return "Stay near busy transport hubs for better earnings.";
  }
}

export async function chatWithBodaPesa(
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  language: Language
): Promise<string> {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are BodaPesa AI, a friendly financial assistant for Boda Boda riders and informal workers in East Africa.
    You speak English, Swahili, and Luganda fluently.
    Your goal is to help users understand their trust score, manage savings, and find earning opportunities.
    Be encouraging, culturally relevant, and use local slang where appropriate (e.g., "Wewaawo", "Sawa").
    Current Language: ${language}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: { systemInstruction }
    });
    return response.text || "I'm here to help! Could you repeat that?";
  } catch (error) {
    console.error("Chat error:", error);
    return "Pole sana, I'm having a bit of trouble connecting. Try again later!";
  }
}
