import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, action, customPrompt, subject } = body;

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

    let systemInstruction = "You are EducAI's Quick Note helper. You are designed to assist students in expanding, structuring, or summarizing their rough study notes. Always return clean, well-formatted, and concise output in Markdown. Do not include conversational preambles like 'Here is your note'. Start directly with the response.";
    let userPrompt = "";

    switch (action) {
      case "summarize":
        userPrompt = `Please summarize the following study note on "${subject || "General"}" into a concise executive summary with key takeaways:\n\n${content}`;
        break;
      case "expand":
        userPrompt = `Please expand this brief study note on "${subject || "General"}" into fully fleshed-out, structured study notes with clear explanations, bullet points, and key definitions:\n\n${content}`;
        break;
      case "polish":
        userPrompt = `Please fix grammar, improve clarity, format with beautiful Markdown (headings, lists, bold text), and polish this study note on "${subject || "General"}":\n\n${content}`;
        break;
      case "quiz":
        userPrompt = `Based on the following study note, generate 2 high-quality active recall questions with hidden/foldable answers (using <details><summary>Click to reveal answer</summary>...</details> in Markdown) to test the student's understanding:\n\n${content}`;
        break;
      case "mindmap":
        userPrompt = `Based on the following note, generate a hierarchical mind map outline in Markdown bullet-point format (using indented dashes) mapping the relationships of key concepts:\n\n${content}`;
        break;
      case "custom":
        userPrompt = `Please process this note on "${subject || "General"}" based on this instruction: "${customPrompt}"\n\nNote content:\n${content}`;
        break;
      default:
        userPrompt = `Please format and optimize this note:\n\n${content}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({
      text: response.text || "No response generated."
    });
  } catch (err: any) {
    console.error("AI Note Generation Error:", err);
    return NextResponse.json({
      error: err?.message || "Error processing your note."
    }, { status: 500 });
  }
}
