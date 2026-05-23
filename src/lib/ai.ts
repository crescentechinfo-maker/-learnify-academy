export async function generateCertificateMessage(studentName: string, courseName: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) return ''

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Learnify AI Academy',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          {
            role: 'user',
            content: `Write a short, inspiring certificate achievement message (2-3 sentences) for a student named "${studentName}" who just completed a course titled "${courseName}". Make it personal, professional, and motivating. No quotes, no formatting, plain text only.`,
          },
        ],
        max_tokens: 120,
      }),
    })

    const json = await res.json()
    return json.choices?.[0]?.message?.content?.trim() ?? ''
  } catch {
    return ''
  }
}
