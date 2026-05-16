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
            content: `Você é um assistente de IA especializado em Terapia Ocupacional e Psicologia Infantil, atuando no aplicativo "Corpo e Limites".
Sua tarefa é gerar histórias sociais terapêuticas para crianças com deficiência, autismo ou em desenvolvimento atípico.
Regras Absolutas:
1. FOCO: Autonomia corporal, espaço pessoal, consentimento e toques seguros.
2. TOM: Extremamente lúdico, acolhedor, gentil e simples.
3. SEGURANÇA: NUNCA mencione violência, trauma, abuso ou medo. O foco é prevenção positiva.
4. FORMATO: Você deve retornar APENAS um JSON válido, sem markdown ou explicações antes/depois.
5. ACESSIBILIDADE: Frases curtas e diretas.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
}
