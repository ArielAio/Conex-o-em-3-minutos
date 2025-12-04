import { GoogleGenAI } from "@google/genai";

// Ideally, this comes from a secure backend proxy in production.
// For this MVP/Demo, we rely on the environment variable as per instructions.
// The app checks if key exists before making calls.

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateInsight = async (missionTitle: string, missionAction: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "Conecte sua chave de API para receber insights personalizados profundos sobre esta missão.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Você é um especialista em relacionamentos e psicologia de casais.
        O usuário acabou de completar a seguinte missão de conexão:
        Título: "${missionTitle}"
        Ação: "${missionAction}"
        
        Escreva um insight curto, emocionante e inspirador (máximo 2 frases) parabenizando o casal e explicando psicologicamente por que essa pequena ação fortalece o amor a longo prazo.
        Tom de voz: acolhedor, romântico, sábio.
      `,
    });

    return response.text || "Parabéns por completarem a missão de hoje!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Parabéns! Completar pequenas missões cria grandes memórias.";
  }
};
