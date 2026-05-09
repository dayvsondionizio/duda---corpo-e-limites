export async function generateContent(apiKey: string, prompt: string) {
  if (!apiKey) throw new Error('API Key da Groq não configurada.');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em terapia infantil (Terapia Ocupacional e Psicologia). Sua tarefa é criar histórias sociais ou perguntas de quiz pedagógicas, acolhedoras e seguras para crianças. Use linguagem simples, lúdica e focada em autonomia e respeito ao corpo. Evite temas de trauma ou medo.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
}
