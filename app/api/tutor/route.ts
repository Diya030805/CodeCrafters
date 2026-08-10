import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, prompt } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        text: null,
        error: "GEMINI_API_KEY not found in environment."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Convert messages array to contents format if provided, or use single prompt
    let contents: any[];
    if (Array.isArray(messages) && messages.length > 0) {
      contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
    } else {
      contents = [{ role: 'user', parts: [{ text: prompt || "Hello!" }] }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: "You are BrainBoost AI, a world-class AI Learning Tutor. Your primary goal is to help students learn effectively through clear, engaging, and structured explanations. ALWAYS use markdown formatting: headings (##, ###), bullet lists, bold key concepts, clean comparison tables, and code blocks with language identifiers (e.g. ```typescript, ```cpp, ```python, ```sql, ```json) when applicable. Provide concise, step-by-step guidance.",
        temperature: 0.7,
      }
    });

    return NextResponse.json({
      text: response.text || "No response generated."
    });
  } catch (err: any) {
    console.error("AI Tutor Route Error:", err);
    return NextResponse.json({
      error: err?.message || "Error generating response."
    }, { status: 500 });
  }
}
